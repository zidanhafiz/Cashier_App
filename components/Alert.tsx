'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAlert } from '@/context/AlertProvider';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type Messages = {
  title: string;
  description: string;
  cancel: string;
  continue: string;
};

type Variant = 'save' | 'discard';

export const Alert = ({
  messages,
  variant,
  onClick,
  reject,
}: {
  messages: Messages;
  variant: Variant;
  onClick: (value: any) => void;
  reject: (value?: any) => void;
}) => {
  const { openAlert, setOpenAlert } = useAlert();

  return (
    <AlertDialog
      open={openAlert}
      onOpenChange={setOpenAlert}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{messages.title}</AlertDialogTitle>
          <AlertDialogDescription>{messages.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => reject()}>
            {messages.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            className={cn(
              variant === 'discard' && 'bg-red-500 hover:bg-red-600 text-white'
            )}
            onClick={() => onClick(true)}
          >
            {messages.continue}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const showAlert = async (
  messages: Messages,
  variant: Variant,
  showAlertHandle: (Comp: ReactNode) => void
) => {
  return new Promise((resolve, reject) => {
    showAlertHandle(
      <Alert
        messages={messages}
        variant={variant}
        onClick={resolve}
        reject={reject}
      />
    );
  });
};
