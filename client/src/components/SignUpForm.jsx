import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

function SignUpForm() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [gender, setGender] = useState("");
	const [age, setAge] = useState("");
	const [genderPreference, setGenderPreference] = useState("");

	const { signUp, loading } = useAuthStore();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			await signUp({ name, email, password, gender, age, genderPreference });

			navigate("/home");
		} catch (error) {
			console.error("Error al registrarse:", error);
		}
	};

	return (
		<form
			className="space-y-6"
			onSubmit={handleSubmit}
		>
			<div>
				<label
					htmlFor="name"
					className="block text-sm font-medium text-gray-700"
				>
					Nombre
				</label>
				<div className="mt-1">
					<input
						id="name"
						name="name"
						type="text"
						required
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
					/>
				</div>
			</div>

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
						className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
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
				<div className="mt-1">
					<input
						id="password"
						name="password"
						type="password"
						autoComplete="new-password"
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
					/>
				</div>
			</div>

			<div>
				<label
					htmlFor="age"
					className="block text-sm font-medium text-gray-700"
				>
					Edad
				</label>
				<div className="mt-1">
					<input
						id="age"
						name="age"
						type="number"
						required
						value={age}
						onChange={(e) => setAge(e.target.value)}
						min="18"
						max="120"
						className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
					/>
				</div>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700">
					Género
				</label>
				<div className="mt-2 flex gap-2">
					<div className="flex items-center">
						<input
							id="male"
							name="gender"
							type="checkbox"
							checked={gender === "male"}
							onChange={() => setGender("male")}
							className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
						/>
						<label htmlFor="male" className="ml-2 block text-sm text-gray-900">
							Masculino
						</label>
					</div>
					<div className="flex items-center">
						<input
							id="female"
							name="gender"
							type="checkbox"
							checked={gender === "female"}
							onChange={() => setGender("female")}
							className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
						/>
						<label
							htmlFor="female"
							className="ml-2 block text-sm text-gray-900"
						>
							Femenino
						</label>
					</div>
				</div>
			</div>
			<div>
				<label className="block text-sm font-medium text-gray-700">
					Preferencia
				</label>
				<div className="mt-2 space-y-2">
					<div className="flex items-center">
						<input
							id="prefer-male"
							name="gender-preference"
							type="radio"
							value="male"
							checked={genderPreference === "male"}
							onChange={(e) => setGenderPreference(e.target.value)}
							className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
						/>
						<label
							htmlFor="prefer-male"
							className="ml-2 block text-sm text-gray-900"
						>
							Hombres
						</label>
					</div>
					<div className="flex items-center">
						<input
							id="prefer-female"
							name="gender-preference"
							type="radio"
							value="female"
							checked={genderPreference === "female"}
							onChange={(e) => setGenderPreference(e.target.value)}
							className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
						/>
						<label
							htmlFor="prefer-female"
							className="ml-2 block text-sm text-gray-900"
						>
							Mujeres
						</label>
					</div>
					<div className="flex items-center">
						<input
							id="prefer-both"
							name="gender-preference"
							type="radio"
							value="both"
							checked={genderPreference === "both"}
							onChange={(e) => setGenderPreference(e.target.value)}
							className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
						/>
						<label
							htmlFor="prefer-both"
							className="ml-2 block text-sm text-gray-900"
						>
							Ambos
						</label>
					</div>
				</div>
			</div>

			<div>
				<button
					type="submit"
					className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading
						? "bg-pink-400 cursor-not-allowed"
						: "bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
						}`}
					disabled={loading}
				>
					{loading ? "Creando cuenta..." : "Crear cuenta"}
				</button>
			</div>
		</form>
	);
}

export default SignUpForm;