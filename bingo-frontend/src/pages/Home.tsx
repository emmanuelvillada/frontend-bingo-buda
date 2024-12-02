import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axiosConfig"; // Importa tu instancia configurada de Axios

const Home = () => {
    const navigate = useNavigate();

    const handleStartGame = async () => {
        try {
            // Enviar solicitud al backend para iniciar o unirse a un lobby
            const response = await api.post("/bingo/lobby/join");
            const { lobbyId } = response.data; // Backend debería devolver el ID del lobby

            // Navegar al lobby con el ID como parámetro
            navigate(`/lobby/${lobbyId}`);
        } catch (error) {
            console.error("Error al iniciar el juego:", error);
            alert("No se pudo iniciar el juego. Inténtalo nuevamente.");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
                <h1 className="text-2xl font-bold mb-2">Bienvenido a Bingo Buda</h1>
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
