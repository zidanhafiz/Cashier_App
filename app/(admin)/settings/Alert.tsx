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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Dispatch, ReactNode, SetStateAction } from 'react';

type AlertProps = {
  children: ReactNode;
  type: 'save' | 'discard';
  openAlert: boolean;
  setOpenAlert: Dispatch<SetStateAction<boolean>>;
  onClick?: (callback: () => void) => void;
};

const Alert = ({ children, type, openAlert, setOpenAlert, onClick }: AlertProps) => {
  const saveAlert = {
    title: 'Save Changes',
    description: 'Save changes to update your profile information.',
    cancel: 'Cancel',
    continue: 'Save',
  };
  const discardAlert = {
    title: 'Discard Changes',
    description: 'Are you sure to discard this changes?',
    cancel: 'Cancel',
    continue: 'Yes',
  };

  const Container = ({ children }: { children: ReactNode }) => {
    if (type === 'save') {
      return (
        <AlertDialog
          open={openAlert}
          onOpenChange={setOpenAlert}
        >
          {children}
        </AlertDialog>
      );
    }
    return <AlertDialog>{children}</AlertDialog>;
  };

  return (
    <Container>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {type === 'save' ? saveAlert.title : discardAlert.title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {type === 'save' ? saveAlert.description : discardAlert.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {type === 'save' ? saveAlert.cancel : discardAlert.cancel}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onClick}>
            {type === 'save' ? saveAlert.continue : discardAlert.continue}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </Container>
  );
};

export default Alert;
