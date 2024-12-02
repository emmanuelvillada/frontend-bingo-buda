import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const LoginPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get("token");

        if (token) {
            localStorage.setItem("authToken", token);
            navigate("/home");
        } else {
            const storedToken = localStorage.getItem("authToken");
            if (storedToken) {
                navigate("/home");
            }
        }
    }, [navigate]);

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
