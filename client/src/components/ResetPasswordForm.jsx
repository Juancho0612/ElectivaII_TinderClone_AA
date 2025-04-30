import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const { resetPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    await resetPassword(email);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-semibold">Recuperar contraseña</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="reset-email">
          Ingresa tu correo
        </label>
        <input
          id="reset-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
              placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-pink-600 text-white rounded hover:bg-pink-700 text-sm"
      >
        Enviar enlace de recuperación
      </button>
    </form>
  );
}

export default ResetPasswordForm;
