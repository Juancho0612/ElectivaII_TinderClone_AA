import { useState } from "react";
import Swal from "sweetalert2";
import Modal from "./Modal";

function ForgotPassword({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire("¡Éxito!", data.message, "success");
        onClose();
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (error) {
      console.error("Error al enviar solicitud:", error);
      Swal.fire("Error", "Ocurrió un problema al enviar el correo.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Recuperar contraseña
      </h2>
      <form onSubmit={handleSendReset} className="space-y-4">
        <div>
          <label
            htmlFor="reset-email"
            className="block text-sm font-medium text-gray-700"
          >
            Ingresa tu correo
          </label>
          <input
            type="email"
            id="reset-email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${loading
              ? "bg-pink-400 cursor-not-allowed"
              : "bg-pink-600 hover:bg-pink-700"
              }`}
          >
            {loading ? "Enviando..." : "Enviar enlace"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default ForgotPassword;
