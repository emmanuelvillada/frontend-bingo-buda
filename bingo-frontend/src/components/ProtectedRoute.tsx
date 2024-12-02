import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/axiosConfig";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Llama al backend para verificar si el usuario está autenticado
                const response = await api.get("/auth/verify", {
                    withCredentials: true, // Incluye cookies en la solicitud
                });

                if (response.status === 200) {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error("Usuario no autenticado:", error);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    // Mientras se verifica la autenticación, muestra un loader o nada
    if (isAuthenticated === null) {
        return <div>Verificando autenticación...</div>;
    }

    // Si no está autenticado, redirige al login
    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    // Si está autenticado, renderiza la ruta protegida
    return children;
};

export default ProtectedRoute;
