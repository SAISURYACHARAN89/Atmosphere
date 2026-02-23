import React, { createContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Theme = {
    background: string;
    cardBackground: string;
    border: string;
    text: string;
    textSecondary: string;
    placeholder: string;
    primary: string;
    accent: string;
    inputBackground: string;
    buttonBackground: string;
    buttonText: string;
    iconColor: string;
    tabBarBackground: string;
    tabBarBorder: string;
    statusBarStyle: 'light-content' | 'dark-content';
};

const lightTheme: Theme = {
    background: '#ffffff',
    cardBackground: '#f5f5f5',
    border: '#e0e0e0',
    text: '#111111',
    textSecondary: '#666666',
    placeholder: '#9e9e9e',
    primary: '#333333',
    accent: '#555555',
    inputBackground: '#f0f0f0',
    buttonBackground: '#333333',
    buttonText: '#ffffff',
    iconColor: '#333333',
    tabBarBackground: '#ffffff',
    tabBarBorder: '#e0e0e0',
    statusBarStyle: 'dark-content',
};

const darkTheme: Theme = {
    background: '#050505',
    cardBackground: '#0b0b0b',
    border: '#262626',
    text: '#f2f2f2',
    textSecondary: '#a0a0a0',
    placeholder: '#8a8a8a',
    primary: '#404040',
    accent: '#555555',
    inputBackground: '#1a1a1a',
    buttonBackground: '#333333',
    buttonText: '#ffffff',
    iconColor: '#f2f2f2',
    tabBarBackground: '#0a0a0a',
    tabBarBorder: '#262626',
    statusBarStyle: 'light-content',
};

type ThemeContextValue = {
    theme: Theme;
    mode: 'light' | 'dark';
    toggle: () => void;
    setMode: (m: 'light' | 'dark') => void;
};

export const ThemeContext = createContext<ThemeContextValue>({
    theme: lightTheme,
    mode: 'light',
    toggle: () => { },
    setMode: () => { },
});

export const ThemeProvider = ({ children, initialMode = 'light' }: { children: ReactNode; initialMode?: 'light' | 'dark' }) => {
    const [mode, setMode] = useState<'light' | 'dark' | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const saved = await AsyncStorage.getItem('@app_theme_mode');
                if (saved === 'light' || saved === 'dark') {
                    setMode(saved);
                } else {
                    setMode(initialMode);
                }
            } catch {
                setMode(initialMode);
            } finally {
                setReady(true);
            }
        })();
    }, [initialMode]);

    useEffect(() => {
        if (mode === null) return;
        AsyncStorage.setItem('@app_theme_mode', mode).catch(() => { });
    }, [mode]);

    const setModePersist = (m: 'light' | 'dark') => setMode(m);
    const toggle = () => setMode((m) => (m === 'light' ? 'dark' : 'light'));

    const theme = mode === 'light' ? lightTheme : darkTheme;

    if (!ready) return null;

    return (
        <ThemeContext.Provider value={{ theme, mode: mode as 'light' | 'dark', toggle, setMode: setModePersist }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
