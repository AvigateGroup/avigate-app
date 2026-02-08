import React, { createContext, useContext, useState, useCallback } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedColors } from '@/hooks/useThemedColors';

type ButtonStyle = 'primary' | 'destructive' | 'cancel' | 'default';

interface DialogButton {
  text: string;
  style?: ButtonStyle;
  onPress?: () => void;
}

interface DialogConfig {
  type?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  buttons?: DialogButton[];
}

interface DialogContextType {
  showDialog: (config: DialogConfig) => void;
  showSuccess: (title: string, message: string, onDismiss?: () => void) => void;
  showError: (title: string, message: string, onDismiss?: () => void) => void;
  showWarning: (title: string, message: string, onDismiss?: () => void) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => void;
  showDestructive: (title: string, message: string, onConfirm: () => void, confirmLabel?: string, onCancel?: () => void) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const useDialog = (): DialogContextType => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};

const ICON_MAP: Record<string, { name: keyof typeof Ionicons.glyphMap; color: string }> = {
  success: { name: 'checkmark-circle', color: '#22C55E' },
  error: { name: 'close-circle', color: '#EF4444' },
  warning: { name: 'warning', color: '#F59E0B' },
  info: { name: 'information-circle', color: '#3B82F6' },
};

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colors = useThemedColors();
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<DialogConfig | null>(null);

  const dismiss = useCallback(() => {
    setVisible(false);
    setConfig(null);
  }, []);

  const showDialog = useCallback((cfg: DialogConfig) => {
    setConfig(cfg);
    setVisible(true);
  }, []);

  const showSuccess = useCallback((title: string, message: string, onDismiss?: () => void) => {
    showDialog({
      type: 'success',
      title,
      message,
      buttons: [{ text: 'OK', style: 'primary', onPress: onDismiss }],
    });
  }, [showDialog]);

  const showError = useCallback((title: string, message: string, onDismiss?: () => void) => {
    showDialog({
      type: 'error',
      title,
      message,
      buttons: [{ text: 'OK', style: 'primary', onPress: onDismiss }],
    });
  }, [showDialog]);

  const showWarning = useCallback((title: string, message: string, onDismiss?: () => void) => {
    showDialog({
      type: 'warning',
      title,
      message,
      buttons: [{ text: 'OK', style: 'primary', onPress: onDismiss }],
    });
  }, [showDialog]);

  const showConfirm = useCallback((title: string, message: string, onConfirm: () => void, onCancel?: () => void) => {
    showDialog({
      type: 'info',
      title,
      message,
      buttons: [
        { text: 'Cancel', style: 'cancel', onPress: onCancel },
        { text: 'Confirm', style: 'primary', onPress: onConfirm },
      ],
    });
  }, [showDialog]);

  const showDestructive = useCallback((title: string, message: string, onConfirm: () => void, confirmLabel?: string, onCancel?: () => void) => {
    showDialog({
      type: 'warning',
      title,
      message,
      buttons: [
        { text: 'Cancel', style: 'cancel', onPress: onCancel },
        { text: confirmLabel || 'Confirm', style: 'destructive', onPress: onConfirm },
      ],
    });
  }, [showDialog]);

  const handleButtonPress = (button: DialogButton) => {
    dismiss();
    if (button.onPress) {
      setTimeout(() => button.onPress!(), 200);
    }
  };

  const icon = config?.type ? ICON_MAP[config.type] : null;

  const getButtonStyle = (style?: ButtonStyle) => {
    switch (style) {
      case 'primary':
        return { backgroundColor: colors.primary };
      case 'destructive':
        return { backgroundColor: '#EF4444' };
      case 'cancel':
        return { backgroundColor: colors.border };
      default:
        return { backgroundColor: colors.primary };
    }
  };

  const getButtonTextColor = (style?: ButtonStyle) => {
    if (style === 'cancel') return colors.text;
    return '#FFFFFF';
  };

  return (
    <DialogContext.Provider value={{ showDialog, showSuccess, showError, showWarning, showConfirm, showDestructive }}>
      {children}
      <Modal transparent visible={visible} animationType="fade" onRequestClose={dismiss}>
        <View style={styles.overlay}>
          <View style={[styles.container, { backgroundColor: colors.background }]}>
            {icon && (
              <Ionicons name={icon.name} size={48} color={icon.color} style={styles.icon} />
            )}
            <Text style={[styles.title, { color: colors.text }]}>{config?.title}</Text>
            <Text style={[styles.message, { color: colors.textSecondary }]}>{config?.message}</Text>
            <View style={styles.buttonRow}>
              {(config?.buttons || [{ text: 'OK', style: 'primary' as ButtonStyle }]).map((button, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.button, getButtonStyle(button.style), config?.buttons && config.buttons.length > 1 && { flex: 1 }]}
                  onPress={() => handleButtonPress(button)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.buttonText, { color: getButtonTextColor(button.style) }]}>
                    {button.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </DialogContext.Provider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 100,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
