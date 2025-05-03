import { Server } from "socket.io";

let io;
const connectedUsers = new Map();

/**
 * Inicializa Socket.io y configura el servidor HTTP para manejar conexiones.
 * @param {import("http").Server} httpServer - El servidor HTTP que se utilizará para Socket.io.
 */
export const initializeSocket = (httpServer) => {
	io = new Server(httpServer, {
		cors: {
			origin: process.env.CLIENT_URL,
			credentials: true,
		},
	});

	io.use((socket, next) => {
		const userId = socket.handshake.auth.userId;
		if (!userId) return next(new Error("Invalid user ID"));

		socket.userId = userId;
		next();
	});

	io.on("connection", (socket) => {
		console.log(`User connected with socket id: ${socket.id}`);
		connectedUsers.set(socket.userId, socket.id);

		socket.on("disconnect", () => {
			console.log(`User disconnected with socket id: ${socket.id}`);
			connectedUsers.delete(socket.userId);
		});
	});
};

/**
 * Obtiene la instancia de Socket.io.
 * @throws {Error} Si Socket.io no ha sido inicializado.
 * @returns {Server} La instancia de Socket.io.
 */
export const getIO = () => {
	if (!io) {
		throw new Error("Socket.io not initialized!");
	}
	return io;
};

export const getConnectedUsers = () => connectedUsers;
