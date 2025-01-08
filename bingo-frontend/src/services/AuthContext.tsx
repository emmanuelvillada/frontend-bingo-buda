import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
    user: { name: string; email: string } | null;
    setUser: (user: { name: string; email: string } | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);

    return (
        <AuthContext.Provider value={{ user, setUser }
        }>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
