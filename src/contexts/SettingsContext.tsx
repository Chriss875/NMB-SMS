import React, { createContext, useContext, useState } from 'react';

interface SettingsContextType {
  notificationSettings: {
    announcements: boolean;
    payments: boolean;
  };
  updateNotificationSettings: (settings: Partial<SettingsContextType['notificationSettings']>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notificationSettings, setNotificationSettings] = useState({
    announcements: true,
    payments: true,
  });

  const updateNotificationSettings = (settings: Partial<SettingsContextType['notificationSettings']>) => {
    setNotificationSettings(prev => ({ ...prev, ...settings }));
  };

  return (
    <SettingsContext.Provider 
      value={{
        notificationSettings,
        updateNotificationSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};