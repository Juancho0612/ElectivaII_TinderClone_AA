import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ChangePasswordPage() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError("Token no válido o no proporcionado.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/change-password", {
        resetToken: token,
        newPassword,
      });

      if (response.data.success) {
        toast.success("Contraseña cambiada correctamente");
        navigate("/auth");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700 shadow-lg px-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-pink-600">Cambiar Contraseña</h2>
          <p className="text-sm text-gray-500 mt-1">
            Ingresa tu nueva contraseña para continuar
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nueva Contraseña
            </label>
            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
                placeholder="••••••••"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirmar Contraseña
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
                placeholder="••••••••"
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white font-semibold transition duration-200 ${loading
              ? "bg-pink-400 cursor-not-allowed"
              : "bg-pink-600 hover:bg-pink-700"
              }`}
          >
            {loading ? "Cambiando..." : "Cambiar Contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordPage;
