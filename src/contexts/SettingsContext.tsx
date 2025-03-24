import React, { createContext, useContext, useState } from 'react';

interface SettingsContextType {
  profileSettings: {
    profileVisibility: boolean;
    showEnrollment: boolean;
  };
  notificationSettings: {
    announcements: boolean;
    payments: boolean;
    results: boolean;
  };
  updateProfileSettings: (settings: Partial<SettingsContextType['profileSettings']>) => void;
  updateNotificationSettings: (settings: Partial<SettingsContextType['notificationSettings']>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profileSettings, setProfileSettings] = useState({
    profileVisibility: true,
    showEnrollment: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    announcements: true,
    payments: true,
    results: true,
  });

  const updateProfileSettings = (settings: Partial<SettingsContextType['profileSettings']>) => {
    setProfileSettings(prev => ({ ...prev, ...settings }));
  };

  const updateNotificationSettings = (settings: Partial<SettingsContextType['notificationSettings']>) => {
    setNotificationSettings(prev => ({ ...prev, ...settings }));
  };

  return (
    <SettingsContext.Provider 
      value={{
        profileSettings,
        notificationSettings,
        updateProfileSettings,
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