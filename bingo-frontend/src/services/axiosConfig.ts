import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true, // Incluir cookies en las solicitudes
});

export default api;