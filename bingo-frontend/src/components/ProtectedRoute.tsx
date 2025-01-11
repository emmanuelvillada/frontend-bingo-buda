import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/axiosConfig";
import { useAuth } from "../services/AuthContext";
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const { setUser } = useAuth();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await api.get("/auth/verify", {
                    withCredentials: true,
                });

                if (response.status === 200 && response.data) {
                    setIsAuthenticated(true);
                    // Explicitly type the user data and check required fields
                    const userData = {
                        name: response.data.name,
                        email: response.data.email
                    };
                    setUser(userData);
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (error) {
                console.error("Usuario no autenticado:", error);
                setIsAuthenticated(false);
                setUser(null);
            }
        };

        checkAuth();
    }, [setUser]);

    // Mientras se verifica la autenticación, muestra un loader o nada
    if (isAuthenticated === null) {
        return <div className="flex items-center justify-center h-screen">Verificando autenticación...</div>;
    }

    // Si no está autenticado, redirige al login
    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    // Si está autenticado, renderiza la ruta protegida
    return children;
};

export default ProtectedRoute;
