import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";


const LoginPage = () => {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();


    if (user) {
        navigate("/home");
    }

    useEffect(() => {
        const fetchUser = async (token: string) => {
            try {
                const response = await fetch("http://localhost:3000/api/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get("token");

        if (token) {
            localStorage.setItem("authToken", token);
            fetchUser(token); // Llama a la función después de guardar el token
            navigate("/home");
        } else {
            const storedToken = localStorage.getItem("authToken");
            if (storedToken) {
                fetchUser(storedToken); // Si ya existe un token, obtiene los datos del usuario
                navigate("/home");
            }
        }
    }, [navigate, setUser]);

    const handleLogin = () => {
        window.location.href = "http://localhost:3000/auth/google";
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
            <div className="card bg-white shadow-xl p-6">
                <h2 className="text-2xl font-bold text-center mb-4">Bingo Buda</h2>
                <p className="text-center text-gray-500 mb-6">Inicia sesión para jugar</p>
                <button
                    onClick={handleLogin}
                    className="btn btn-primary w-full"
                >
                    <span className="mr-2">🌐</span>
                    Iniciar sesión con Google
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
