import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState } from 'react';
import i18n from '../i18n';

type LanguageContextType = {
    currentLanguage: string;
    changeLanguage: (code: string) => Promise<void>;
};

const LanguageContext = createContext<LanguageContextType>({
    currentLanguage: 'en',
    changeLanguage: async () => { },
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

    const changeLanguage = async (code: string) => {
        await i18n.changeLanguage(code);
        await AsyncStorage.setItem('appLanguage', code);
        setCurrentLanguage(code);
    };

    return (
        <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);