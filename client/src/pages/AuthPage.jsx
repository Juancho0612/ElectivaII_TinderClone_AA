import { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";
import image1 from "/female/1.jpg";
import image2 from "/male/1.jpg";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-pink-500 p-4">
      <div className="flex w-full max-w-5xl items-center justify-between">

        <div className="hidden lg:block w-1/2 transform -rotate-12 mx-10">
          <img
            src={image1}
            alt="Imagen izquierda"
            className="w-full h-auto object-cover rounded-xl shadow-lg"
          />
        </div>

        <div className="w-full max-w-md shadow-2xl rounded-lg p-8 relative z-10">
          <h2 className="text-center text-3xl font-extrabold text-gray-100 mb-8">
            {isLogin
              ? "Inicia sesión para conectar"
              : "Crea una cuenta para empezar a conectar"}
          </h2>

          <div className="bg-white shadow-xl rounded-lg p-8">
            {isLogin ? <LoginForm /> : <SignUpForm />}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "¿Eres nuevo?" : "¿Ya tienes una cuenta?"}
              </p>

              <button
                onClick={() => setIsLogin((prevIsLogin) => !prevIsLogin)}
                className="mt-2 text-red-600 hover:text-red-800 font-medium transition-colors duration-300"
              >
                {isLogin ? "Crear una cuenta" : "Iniciar sesión"}
              </button>
            </div>
          </div>
        </div>

        <div className="hidden lg:block w-1/2 transform rotate-12 mx-10">
          <img
            src={image2}
            alt="Imagen derecha"
            className="w-full h-auto object-cover rounded-xl shadow-lg"
          />
        </div>

      </div>
    </div>
  );
}

export default AuthPage;
