import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import { Toaster } from "react-hot-toast";

function App() {
	const { checkAuth, authUser, checkingAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (checkingAuth) return <div>Loading...</div>; 

	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<HomePage />} />
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
