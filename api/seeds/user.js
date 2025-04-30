import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Nombres masculinos predeterminados.
 * @type {string[]}
 */
const maleNames = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas"];

/**
 * Nombres femeninos predeterminados.
 * @type {string[]}
 */
const femaleNames = [
	"Mary",
	"Patricia",
	"Jennifer",
	"Linda",
	"Elizabeth",
	"Barbara",
	"Susan",
	"Jessica",
	"Sarah",
	"Karen",
	"Nancy",
	"Lisa",
];

/**
 * Preferencias de género predeterminadas para los usuarios.
 * @type {string[]}
 */
const genderPreferences = ["male", "female", "both"];

/**
 * Descriptores para generar biografías aleatorias.
 * @type {string[]}
 */
const bioDescriptors = [
	"Coffee addict",
	"Cat lover",
	"Dog person",
	"Foodie",
	"Gym rat",
	"Bookworm",
	"Movie buff",
	"Music lover",
	"Travel junkie",
	"Beach bum",
	"City slicker",
	"Outdoor enthusiast",
	"Netflix binger",
	"Yoga enthusiast",
	"Craft beer connoisseur",
	"Sushi fanatic",
	"Adventure seeker",
	"Night owl",
	"Early bird",
	"Aspiring chef",
];

/**
 * Genera una biografía aleatoria para un usuario.
 * @returns {string} La biografía generada.
 */
const generateBio = () => {
	const descriptors = bioDescriptors.sort(() => 0.5 - Math.random()).slice(0, 3);
	return descriptors.join(" | ");
};

/**
 * Genera un usuario aleatorio con los parámetros de género y un índice.
 * @param {string} gender - El género del usuario (masculino o femenino).
 * @param {number} index - El índice para determinar el nombre y otros detalles.
 * @returns {Object} El objeto de usuario generado.
 */
const generateRandomUser = (gender, index) => {
	const names = gender === "male" ? maleNames : femaleNames;
	const name = names[index];
	const age = Math.floor(Math.random() * (45 - 21 + 1) + 21);
	return {
		name,
		email: `${name.toLowerCase()}${age}@example.com`,
		password: bcrypt.hashSync("password123", 10),
		age,
		gender,
		genderPreference: genderPreferences[Math.floor(Math.random() * genderPreferences.length)],
		bio: generateBio(),
		image: `/${gender}/${index + 1}.jpg`,
	};
};

/**
 * Función principal para sembrar usuarios en la base de datos.
 * - Limpia la colección de usuarios.
 * - Genera usuarios masculinos y femeninos.
 * - Inserta los usuarios generados en la base de datos.
 */
const seedUsers = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);

		await User.deleteMany({});

		const maleUsers = maleNames.map((_, i) => generateRandomUser("male", i));
		const femaleUsers = femaleNames.map((_, i) => generateRandomUser("female", i));

		const allUsers = [...maleUsers, ...femaleUsers];

		await User.insertMany(allUsers);

		console.log("Database seeded successfully with users having concise bios");
	} catch (error) {
		console.error("Error seeding database:", error);
	} finally {
		mongoose.disconnect();
	}
};

seedUsers();
