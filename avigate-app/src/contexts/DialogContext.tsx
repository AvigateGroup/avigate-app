// src/contexts/DialogContext.tsx

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CustomDialog, CustomDialogProps, DialogButton, DialogType } from '@/components/CustomDialog';

interface ShowDialogOptions {
  type?: DialogType;
  title: string;
  message?: string;
  icon?: string;
  buttons?: DialogButton[];
  dismissable?: boolean;
}

interface DialogContextType {
  showDialog: (options: ShowDialogOptions) => void;
  hideDialog: () => void;
  showConfirm: (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => void;
  showSuccess: (title: string, message?: string, onOk?: () => void) => void;
  showError: (title: string, message?: string, onOk?: () => void) => void;
  showWarning: (title: string, message?: string, onOk?: () => void) => void;
  showDestructive: (title: string, message: string, onConfirm: () => void, confirmText?: string) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dialogProps, setDialogProps] = useState<CustomDialogProps>({
    visible: false,
    title: '',
    type: 'info',
  });

  const showDialog = useCallback((options: ShowDialogOptions) => {
    setDialogProps({
      visible: true,
      ...options,
      onDismiss: () => {
        setDialogProps(prev => ({ ...prev, visible: false }));
      },
    });
  }, []);

  const hideDialog = useCallback(() => {
    setDialogProps(prev => ({ ...prev, visible: false }));
  }, []);

  const showConfirm = useCallback(
    (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => {
      showDialog({
        type: 'confirm',
        title,
        message,
        buttons: [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: onCancel,
          },
          {
            text: 'Confirm',
            style: 'primary',
            onPress: onConfirm,
          },
        ],
      });
    },
    [showDialog]
  );

  const showSuccess = useCallback(
    (title: string, message?: string, onOk?: () => void) => {
      showDialog({
        type: 'success',
        title,
        message,
        buttons: [
          {
            text: 'OK',
            style: 'primary',
            onPress: onOk,
          },
        ],
      });
    },
    [showDialog]
  );

  const showError = useCallback(
    (title: string, message?: string, onOk?: () => void) => {
      showDialog({
        type: 'error',
        title,
        message,
        buttons: [
          {
            text: 'OK',
            style: 'primary',
            onPress: onOk,
          },
        ],
      });
    },
    [showDialog]
  );

  const showWarning = useCallback(
    (title: string, message?: string, onOk?: () => void) => {
      showDialog({
        type: 'warning',
        title,
        message,
        buttons: [
          {
            text: 'OK',
            style: 'primary',
            onPress: onOk,
          },
        ],
      });
    },
    [showDialog]
  );

  const showDestructive = useCallback(
    (title: string, message: string, onConfirm: () => void, confirmText: string = 'Delete') => {
      showDialog({
        type: 'destructive',
        title,
        message,
        buttons: [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: confirmText,
            style: 'destructive',
            onPress: onConfirm,
          },
        ],
      });
    },
    [showDialog]
  );

  const value: DialogContextType = {
    showDialog,
    hideDialog,
    showConfirm,
    showSuccess,
    showError,
    showWarning,
    showDestructive,
  };

  return (
    <DialogContext.Provider value={value}>
      {children}
      <CustomDialog {...dialogProps} />
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};
