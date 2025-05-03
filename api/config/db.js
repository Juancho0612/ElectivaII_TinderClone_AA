import mongoose from "mongoose";

/**
 * Connect the application to the MongoDB database using Mongoose.
 * 
 * @async
 * @function connectDB
 * @throws {Error} 
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error conectando a MongoDB: ", error.message);
    console.error("Detalles del error:", error);
    process.exit(1);
  }
};
