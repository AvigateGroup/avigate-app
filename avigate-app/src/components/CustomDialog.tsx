// src/components/CustomDialog.tsx

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useThemedColors } from '@/hooks/useThemedColors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type DialogType = 'success' | 'warning' | 'error' | 'info' | 'confirm' | 'destructive';

export interface DialogButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive' | 'primary';
}

export interface CustomDialogProps {
  visible: boolean;
  type?: DialogType;
  title: string;
  message?: string;
  icon?: string;
  buttons?: DialogButton[];
  onDismiss?: () => void;
  dismissable?: boolean;
}

export const CustomDialog: React.FC<CustomDialogProps> = ({
  visible,
  type = 'info',
  title,
  message,
  icon,
  buttons = [{ text: 'OK', style: 'primary' }],
  onDismiss,
  dismissable = true,
}) => {
  const colors = useThemedColors();

  const getIconConfig = () => {
    if (icon) return { name: icon, color: colors.primary };

    switch (type) {
      case 'success':
        return { name: 'checkmark-circle', color: '#10B981' };
      case 'warning':
        return { name: 'warning', color: '#F59E0B' };
      case 'error':
        return { name: 'close-circle', color: '#EF4444' };
      case 'destructive':
        return { name: 'trash', color: '#DC2626' };
      case 'confirm':
        return { name: 'help-circle', color: '#3B82F6' };
      default:
        return { name: 'information-circle', color: colors.primary };
    }
  };

  const iconConfig = getIconConfig();

  const handleButtonPress = (button: DialogButton) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onDismiss) {
      onDismiss();
    }
  };

  const handleBackdropPress = () => {
    if (dismissable && onDismiss) {
      onDismiss();
    }
  };

  const getButtonStyle = (buttonStyle: string = 'default') => {
    switch (buttonStyle) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
          borderWidth: 0,
        };
      case 'destructive':
        return {
          backgroundColor: '#EF4444',
          borderWidth: 0,
        };
      case 'cancel':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border,
        };
      default:
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border,
        };
    }
  };

  const getButtonTextStyle = (buttonStyle: string = 'default') => {
    switch (buttonStyle) {
      case 'primary':
        return { color: '#FFFFFF', fontWeight: '600' as const };
      case 'destructive':
        return { color: '#FFFFFF', fontWeight: '600' as const };
      case 'cancel':
        return { color: colors.textMuted, fontWeight: '500' as const };
      default:
        return { color: colors.text, fontWeight: '500' as const };
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleBackdropPress}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={[styles.dialogContainer, { backgroundColor: colors.white }]}>
              {/* Icon */}
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${iconConfig.color}15` },
                ]}
              >
                <Icon name={iconConfig.name} size={40} color={iconConfig.color} />
              </View>

              {/* Title */}
              <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

              {/* Message */}
              {message && (
                <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text>
              )}

              {/* Buttons */}
              <View
                style={[
                  styles.buttonsContainer,
                  buttons.length > 2 && styles.buttonsContainerVertical,
                ]}
              >
                {buttons.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.button,
                      getButtonStyle(button.style),
                      buttons.length > 2 && styles.buttonVertical,
                    ]}
                    onPress={() => handleButtonPress(button)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.buttonText, getButtonTextStyle(button.style)]}>
                      {button.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialogContainer: {
    width: Math.min(SCREEN_WIDTH - 40, 360),
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  buttonsContainerVertical: {
    flexDirection: 'column',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonVertical: {
    flex: 0,
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
