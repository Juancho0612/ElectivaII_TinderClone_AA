import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import { Toaster } from "react-hot-toast";
import ChangePasswordPage from "./pages/ChangePasswordPage";

function App() {
	const { checkAuth, authUser, checkingAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (checkingAuth) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<span className="text-xl font-semibold text-gray-600 animate-pulse">Cargando...</span>
			</div>
		);
	}

	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/auth/change-password/:token" element={<ChangePasswordPage />} />
				<Route
					path="/home"
					element={authUser ? <LoginPage /> : <Navigate to="/auth" />}
				/>
				<Route
					path="/auth"
					element={!authUser ? <AuthPage /> : <Navigate to="/home" />}
				/>
				<Route
					path="/profile"
					element={authUser ? <ProfilePage /> : <Navigate to="/auth" />}
				/>
				<Route
					path="/chat/:id"
					element={authUser ? <ChatPage /> : <Navigate to="/auth" />}
				/>
			</Routes>

			<Toaster />
		</div>
	);
}

export default App;
