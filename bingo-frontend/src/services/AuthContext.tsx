import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "../types/user"; // Importa la interfaz User

interface AuthContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>; // Permite actualizar el usuario
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null); // Usa la interfaz correcta

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
