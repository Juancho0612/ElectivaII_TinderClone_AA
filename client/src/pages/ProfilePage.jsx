import { useRef, useState } from "react";
import Header from "../components/Header";
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";

function ProfilePage() {
	const { authUser } = useAuthStore();
	const { loading, updateProfile } = useUserStore();

	const [name, setName] = useState(authUser.name || "");
	const [bio, setBio] = useState(authUser.bio || "");
	const [age, setAge] = useState(authUser.age || "");
	const [gender, setGender] = useState(authUser.gender || "");
	const [genderPreference, setGenderPreference] = useState(authUser.genderPreference || "");
	const [image, setImage] = useState(authUser.image || null);

	const fileInputRef = useRef(null);

	const handleSubmit = (e) => {
		e.preventDefault();
		updateProfile({ name, bio, age, gender, genderPreference, image });

		useAuthStore.setState({
			authUser: {
				...authUser,
				name,
				bio,
				age,
				gender,
				genderPreference,
				image,
			},
		});
	};


	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => setImage(reader.result);
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			<Header />

			<div className="flex-grow flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Mi perfil
					</h2>
				</div>

				<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
					<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
						<form onSubmit={handleSubmit} className="space-y-6">
							<div>
								<label htmlFor="name" className="block text-sm font-medium text-gray-700">
									Nombre
								</label>
								<input
									id="name"
									name="name"
									type="text"
									required
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-pink-500 focus:border-pink-500"
								/>
							</div>

							<div>
								<label htmlFor="age" className="block text-sm font-medium text-gray-700">
									Edad
								</label>
								<input
									id="age"
									name="age"
									type="number"
									required
									value={age}
									onChange={(e) => setAge(e.target.value)}
									className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-pink-500 focus:border-pink-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Género</label>
								<div className="flex space-x-4">
									{["Masculino", "Femenino"].map((label) => {
										const value = label === "Masculino" ? "male" : "female";
										return (
											<label key={value} className="inline-flex items-center">
												<input
													type="radio"
													className="form-radio text-pink-600"
													name="gender"
													value={value}
													checked={gender === value}
													onChange={() => setGender(value)}
												/>
												<span className="ml-2">{label}</span>
											</label>
										);
									})}
								</div>
							</div>

							{/* Preferencia */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Preferencia</label>
								<div className="flex space-x-4">
									{["Masculino", "Femenino", "Ambos"].map((label) => {
										const value =
											label === "Masculino" ? "male" :
												label === "Femenino" ? "female" : "both";

										return (
											<label key={value} className="inline-flex items-center">
												<input
													type="radio"
													className="form-radio text-pink-600"
													name="genderPreference"
													value={value}
													checked={genderPreference === value}
													onChange={() => setGenderPreference(value)}
												/>
												<span className="ml-2">{label}</span>
											</label>
										);
									})}
								</div>
							</div>

							{/* Bio */}
							<div>
								<label htmlFor="bio" className="block text-sm font-medium text-gray-700">
									Descripción
								</label>
								<textarea
									id="bio"
									name="bio"
									rows={3}
									value={bio}
									onChange={(e) => setBio(e.target.value)}
									className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-pink-500 focus:border-pink-500"
								/>
							</div>

							{/* Imagen */}
							<div>
								<label className="block text-sm font-medium text-gray-700">Imagen</label>
								<div className="mt-1 flex items-center">
									<button
										type="button"
										onClick={() => fileInputRef.current.click()}
										className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
									>
										Actualizar imagen
									</button>
									<input
										ref={fileInputRef}
										type="file"
										accept="image/*"
										className="hidden"
										onChange={handleImageChange}
									/>
								</div>
								{image && (
									<div className="mt-4">
										<img
											src={image}
											alt="User"
											className="w-48 h-48 object-cover rounded-md"
										/>
									</div>
								)}
							</div>

							{/* Botón de guardar */}
							<button
								type="submit"
								disabled={loading}
								className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
							>
								{loading ? "Guardando..." : "Guardar cambios"}
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ProfilePage;
