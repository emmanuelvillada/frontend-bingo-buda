import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../services/socket"; // Configuración del WebSocket
import api from "../services/axiosConfig"; // Instancia de Axios configurada

interface Player {
    id: number;
    name: string;
}

const LobbyPage = () => {
    const { lobbyId } = useParams(); // Obtener el ID del lobby desde la URL
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(60); // Temporizador inicial
    const [players, setPlayers] = useState<Player[]>([]); // Lista de jugadores
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Unirse al lobby al montar el componente
        const joinLobby = async () => {
            try {
                // Emitir evento para unirse al lobby
                socket.emit("join-lobby", { lobbyId, player: { id: socket.id, name: "PlayerName" } });

                // Obtener datos iniciales del lobby desde el servidor
                const response = await api.get(`/bingo/lobby/${lobbyId}`);
                setPlayers(response.data.players);
                setCountdown(response.data.timeLeft || 60);
                setLoading(false);
            } catch (error) {
                console.error("Error al unirse al lobby:", error);
                navigate("/"); // Redirigir al home si ocurre un error
            }
        };

        joinLobby();
        socket.on('connect', () => {
            console.log('Socket connected successfully');
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
        });

        // Escuchar eventos WebSocket
        socket.on("player-joined", (player: Player) => {
            setPlayers((prevPlayers) => [...prevPlayers, player]);
        });

        socket.on('game-start', () => {
            console.log('¡El juego ha comenzado!');
            navigate(`/game/${lobbyId}`);
        });

        // Escuchar tiempo restante
        socket.on("time-left", (time: number) => {
            setCountdown(time);
        });

        return () => {
            // Limpiar eventos WebSocket al desmontar el componente
            socket.off("player-joined");
            socket.off("game-start");
            socket.off("time-left");
        };
    }, [lobbyId, navigate]);

    // Manejar inicio manual del juego
    const handleStartGame = async () => {
        try {
            await api.post(`/bingo/game/start/${lobbyId}`);
            console.log("¡El juego comienza!");
            navigate(`/game/${lobbyId}`);
        } catch (error) {
            console.error("Error al comenzar el juego:", error);
            alert("No se pudo iniciar el juego.");
        }
    };

    if (loading) return <p>Cargando lobby...</p>;

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
                <h1 className="text-2xl font-bold mb-2">Lobby de espera</h1>
                <p className="text-gray-600 mb-6">Esperando a más jugadores...</p>

                <div className="text-4xl font-bold mb-4">{countdown}</div>
                <p className="text-gray-600 mb-4">segundos restantes</p>

                <div className="w-full bg-gray-300 rounded-full h-2.5 mb-4">
                    <div
                        className="bg-black h-2.5 rounded-full"
                        style={{ width: `${((60 - countdown) / 60) * 100}%` }}
                    ></div>
                </div>

                <p className="text-gray-600 mb-4">
                    Jugadores: {players.length} (Min: 2)
                </p>
                <ul className="list-disc list-inside text-left mb-4">
                    {players.map((player) => (
                        <li key={player.id} className="text-gray-800">
                            {player.name}
                        </li>
                    ))}
                </ul>

                <button
                    onClick={handleStartGame}
                    disabled={players.length < 2 || countdown <= 30} // Solo permite iniciar si hay suficientes jugadores y han pasado 30s
                    className={`w-full py-2 rounded-lg font-semibold transition duration-300 ${players.length < 2 || countdown <= 30
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-black text-white hover:bg-gray-800"
                        }`}
                >
                    Comenzar juego
                </button>
            </div>
        </div>
    );
};

export default LobbyPage;
