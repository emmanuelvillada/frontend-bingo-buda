import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import socket from "../services/socket"; // Configuración del WebSocket
import api from "../services/axiosConfig"; // Instancia de Axios configurada

interface Ballot {
    number: number;
    called: boolean;
}

interface BingoCard {
    id: string;
    card: number[][]; // Matriz de números del tarjetón
}

const GamePage = () => {
    const { lobbyId } = useParams(); // Obtener el ID del lobby
    const [bingoCard, setBingoCard] = useState<BingoCard | null>(null);
    const [ballots, setBallots] = useState<Ballot[]>([]); // Balotas sacadas
    const [players, setPlayers] = useState<string[]>([]); // Jugadores activos
    const [currentBallot, setCurrentBallot] = useState<Ballot | null>(null); // Última balota
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGameData = async () => {
            try {
                // Obtener información inicial del juego desde el backend
                const response = await api.get(`/bingo/game/${lobbyId}`);
                setBingoCard(response.data.bingoCard); // Tarjetón del jugador
                setPlayers(response.data.players); // Jugadores activos
                setBallots(response.data.ballots); // Balotas previas
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener datos del juego:", error);
            }
        };

        fetchGameData();

        // Escuchar eventos de WebSocket
        socket.on("new-ballot", (ballot: Ballot) => {
            setBallots((prev) => [...prev, ballot]);
            setCurrentBallot(ballot); // Actualizar la última balota
        });

        socket.on("player-wins", (winner: string) => {
            alert(`¡${winner} ha ganado el juego!`);
        });

        return () => {
            // Limpiar eventos al desmontar el componente
            socket.off("new-ballot");
            socket.off("player-wins");
        };
    }, [lobbyId]);

    const handleClaimBingo = () => {
        socket.emit("claim-bingo", { lobbyId, playerId: socket.id });
    };

    if (loading) return <p>Cargando juego...</p>;

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-green-400 to-blue-600">
            <div className="text-center text-white mb-6">
                <h1 className="text-3xl font-bold">Bingo Game</h1>
                <p className="text-lg">Jugadores activos: {players.length}</p>
            </div>

            {/* Mostrar última balota */}
            {currentBallot && (
                <div className="bg-white p-4 rounded-lg shadow-md mb-6 text-center max-w-xs">
                    <p className="text-lg text-gray-700">Última balota:</p>
                    <p className="text-4xl font-bold text-blue-500">
                        {currentBallot.number}
                    </p>
                </div>
            )}

            {/* Tarjetón de bingo */}
            <div className="grid grid-cols-5 gap-2 mb-6">
                {bingoCard &&
                    bingoCard.card.map((row, rowIndex) =>
                        row.map((number, colIndex) => (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`w-16 h-16 flex items-center justify-center font-bold text-lg rounded-lg ${ballots.some((b) => b.number === number)
                                        ? "bg-green-500 text-white"
                                        : "bg-white text-black"
                                    }`}
                            >
                                {number}
                            </div>
                        ))
                    )}
            </div>

            {/* Botón para reclamar bingo */}
            <button
                onClick={handleClaimBingo}
                className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg shadow-md hover:bg-yellow-400 transition"
            >
                ¡Reclamar Bingo!
            </button>
        </div>
    );
};

export default GamePage;
