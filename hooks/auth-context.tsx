// components/auth-context.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

interface User {
	id: string;
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	gender: string;
	image: string;
	accessToken: string;
}

type AuthContextType = {
    isAuthenticated: boolean;
    userProfile: User | null;
    setAuthenticated: (value: boolean) => void;
    userToken: string | null;
    login: (token: string, userProfile: User) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [userToken, setUserToken] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<User | null>(null);

    const login = async (token: string, userProfile: User) => {
        setUserToken(token);
        setAuthenticated(true);
        setUserProfile(userProfile);
        await SecureStore.setItemAsync('userToken', token);
        await SecureStore.setItemAsync('userProfile', JSON.stringify(userProfile));
    };

    const logout = async () => {
        setUserToken(null);
        setAuthenticated(false);
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userProfile');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userProfile, setAuthenticated, userToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};