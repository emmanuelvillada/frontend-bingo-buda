import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axiosConfig"; // Axios configurado
import { useAuth } from "../services/AuthContext";

const Home = () => {
    const navigate = useNavigate();
    const { user, setUser } = useAuth(); // Obtén el usuario y la función para actualizarlo

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get("/auth/verify"); // Llamada a la API
                setUser(response.data.user); // Guarda el usuario en el contexto
            } catch (error) {
                console.error("Error al verificar el usuario:", error);
                setUser(null); // En caso de error, limpiamos el usuario
            }
        };

        if (!user) fetchUser();
    }, [user, setUser]); // Se ejecuta al montar el componente

    const handleStartGame = async () => {
        try {
            const response = await api.post("/bingo/lobby/join");
            const { lobbyId } = response.data;
            navigate(`/lobby/${lobbyId}`);
        } catch (error) {
            console.error("Error al iniciar el juego:", error);
            alert("No se pudo iniciar el juego. Inténtalo nuevamente.");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
                <h1 className="text-2xl font-bold mb-2">
                    {user ? `Bienvenido, ${user.name}!` : "Bienvenido a Bingo Buda"}
                </h1>
                <p className="text-gray-600 mb-6">¿Listo para jugar?</p>
                <button
                    onClick={handleStartGame}
                    className="btn btn-primary w-full bg-black text-white font-semibold py-2 rounded-lg hover:bg-gray-800 transition duration-300"
                >
                    Iniciar juego
                </button>
            </div>
        </div>
    );
};

export default Home;
