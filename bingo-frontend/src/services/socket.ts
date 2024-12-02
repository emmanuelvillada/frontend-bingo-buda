import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
});

socket.on('connect', () => {
    console.log('Conectado al servidor de WebSocket');
});

socket.on('connect_error', (error) => {
    console.error('Error de conexión:', error);
});

export default socket;