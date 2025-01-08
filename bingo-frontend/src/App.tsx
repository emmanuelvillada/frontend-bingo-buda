import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./services/AuthContext";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta pública para el Login */}
          <Route path="/" element={<Login />} />

          {/* Ruta protegida para Home */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Ruta protegida para Lobby */}
          <Route
            path="/lobby/:lobbyId"
            element={
              <ProtectedRoute>
                <Lobby />
              </ProtectedRoute>
            }
          />
          {/* Ruta protegida para Lobby */}
          <Route
            path="/game/:lobbyId"
            element={
              <ProtectedRoute>
                <Game />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
