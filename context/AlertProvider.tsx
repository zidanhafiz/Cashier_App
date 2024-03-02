'use client';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

interface AlertContextType {
  openAlert: boolean;
  setOpenAlert: Dispatch<SetStateAction<boolean>>;
  alert: ReactNode;
  setAlert: Dispatch<SetStateAction<ReactNode>>;
  showAlertHandle: (Comp: ReactNode) => void;
}

const AlertContext = createContext<AlertContextType | null>(null);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within a AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alert, setAlert] = useState<ReactNode | null>(null);

  const showAlertHandle = (Comp: ReactNode) => {
    setAlert(Comp);
    setOpenAlert(true);
  };

  const value = { openAlert, setOpenAlert, alert, setAlert, showAlertHandle };

  return (
    <AlertContext.Provider value={value}>
      {openAlert && alert}
      {children}
    </AlertContext.Provider>
  );
};
