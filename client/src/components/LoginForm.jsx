import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import ForgotPassword from "./ForgotPassword";
import Logo from "/logo/logo.png";
import { HiEye, HiEyeOff } from "react-icons/hi";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  return (
    <div>
      <img
        src={Logo}
        alt="App Logo"
        className="w-24 h-24 mb-4 mx-auto"
      />
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          login({ email, password });
        }}
      >
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Correo electrónico
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
               placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Contraseña
          </label>
          <div className="mt-1 relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
            			placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
            >
              {showPassword ? (
                <HiEyeOff className="h-5 w-5" />
              ) : (
                <HiEye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <p className="text-sm text-right">
          <button onClick={() => setIsResetOpen(true)} type="button" className="text-sm text-pink-600 hover:underline">
            ¿Olvidaste tu contraseña?
          </button>
        </p>

        <button
          type="submit"
          className={`w-full flex justify-center py-2 px-4 border border-transparent 
            rounded-md shadow-sm text-sm font-medium text-white ${loading
              ? "bg-pink-400 cursor-not-allowed"
              : "bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            }`}
          disabled={loading}
        >
          {loading ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>
      </form>

      <ForgotPassword isOpen={isResetOpen} onClose={() => setIsResetOpen(false)} />

    </div>
  );
}

export default LoginForm;
