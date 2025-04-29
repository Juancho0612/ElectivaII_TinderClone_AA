import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br
    from-red-500 to bg-pink-500 p-4"
    >
      <div className="w-full max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-white mb-8">
          {isLogin ? "Inicia sesión para deslizar" : "Crea una cuenta para deslizar"}
        </h2>

        <div className="bg-white shaow-xl rounded-lg p-8">
          {isLogin ? <LoginForm /> : <SignUpForm />}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Eres nuevo?" : "Ya tienes una cuenta?"}
            </p>

            <button
              onClick={() => setIsLogin((preIsLogin) => !preIsLogin)}
              className="mt-2 text-red-600 hover:text-red-800 font-medium transition-colors duration-300"
            >
              {isLogin ? "Crear una cuenta" : "Iniciar sesión"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
