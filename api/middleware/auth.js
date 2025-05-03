import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * @function protectRoute
 * @description Middleware para proteger rutas que requieren autenticación. Verifica el token JWT enviado en los headers de autorización.
 * @param {Object} req - Objeto de solicitud de Express, espera el token JWT en `req.headers.authorization`.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función de middleware para pasar al siguiente manejador.
 * @returns {void} - Si el token es válido, agrega el usuario autenticado a `req.user` y llama a `next()`. De lo contrario, responde con un error 401 o 500.
 */
export const protectRoute = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized - No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "No autorizado - Token invalido",
      });
    }

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "No autorizado - Usuario no encontrado",
      });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    console.log("Error en auth middleware: ", error);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "No autorizado - token invalido",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Error en el servidor",
      });
    }
  }
};
