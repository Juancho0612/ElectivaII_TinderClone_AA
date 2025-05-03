import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { sendPasswordResetEmail } from "./../config/sendEmail.js";

/**
 * @function signToken
 * @description Genera un token JWT para un usuario autenticado.
 * @param {string} id - ID del usuario.
 * @returns {string} - Token JWT con expiración de 2 días.
 */
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });
};

/**
 * @function signup
 * @description Registra un nuevo usuario en la base de datos y retorna un token JWT.
 * @route POST /api/auth/signup
 * @param {Object} req - Objeto de solicitud de Express, contiene nombre, correo, contraseña, edad, género y preferencia de género.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Objeto JSON con el nuevo usuario creado y su token.
 * @throws {Error} - Maneja errores de validación y duplicación de correo electrónico.
 */
export const signup = async (req, res) => {
  const { name, email, password, age, gender, genderPreference } = req.body;
  try {
    if (!name || !email || !password || !age || !gender || !genderPreference) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son requeridos",
      });
    }

    if (age < 18) {
      return res.status(400).json({
        success: false,
        message: "Debe ser mayor de 18 años",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "La contraseña debe ser de 8 caracteres",
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      age,
      gender,
      genderPreference,
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      success: true,
      user: newUser,
      token,
    });
  } catch (error) {
    console.log("Error en el registro del controlador:", error);

    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(400).json({
        success: false,
        message: "El correo eletronico ya existe",
      });
    }

    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

/**
 * @function login
 * @description Autentica a un usuario con correo y contraseña, y devuelve un token JWT si las credenciales son válidas.
 * @route POST /api/auth/login
 * @param {Object} req - Objeto de solicitud de Express, contiene correo y contraseña.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Objeto JSON con los datos del usuario y el token.
 * @throws {Error} - Maneja errores de autenticación y errores del servidor.
 */
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son requeridos",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Correo o contraseña invalidos",
      });
    }

    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Correo o contraseña invalidos",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.status(200).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    console.error("Error en el login del controlador:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

/**
 * @function logout
 * @description Finaliza la sesión del usuario
 * @route POST /api/auth/logout
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Objeto JSON con un mensaje de cierre de sesión exitoso.
 */
export const logout = async (req, res) => {
  res.status(200).json({ success: true, message: "Ingreso correctamente" });
};

/**
 * Recibe un correo electrónico, verifica si el usuario existe y envía un correo para restablecer la contraseña.
 * @param {object} req - El objeto de la solicitud HTTP.
 * @param {object} res - El objeto de la respuesta HTTP.
 */
export const resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No se encontró una cuenta con ese correo electrónico.",
      });
    }

    const timestamp = Date.now();
    const tokenPayload = JSON.stringify({ email: user.email, timestamp });
    const resetToken = Buffer.from(tokenPayload).toString("base64");
    const resetLink = `${
      process.env.CLIENT_URL
    }/auth/change-password/${encodeURIComponent(resetToken)}`;

    await sendPasswordResetEmail(user.email, resetLink);

    res.status(200).json({
      success: true,
      message: "Correo de recuperación enviado.",
    });
  } catch (error) {
    console.error("Error en recuperación:", error);
    res.status(500).json({
      success: false,
      message: "Error al enviar el correo.",
    });
  }
};

/**
 * Actualiza la contraseña del usuario.
 * Verifica si el token es válido y actualiza la contraseña en la base de datos.
 * @param {Object} req - La solicitud del cliente, que contiene el token y la nueva contraseña.
 * @param {Object} res - La respuesta que se enviará al cliente.
 */
export const updatePassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    if (!resetToken || !newPassword) {
      return res.status(400).json({ success: false, message: "Faltan datos." });
    }

    let decoded;
    try {
      decoded = Buffer.from(resetToken, "base64").toString("utf-8");
      decoded = JSON.parse(decoded);
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, message: "Token inválido." });
    }

    const { email, timestamp } = decoded;

    if (!email || !timestamp) {
      return res
        .status(400)
        .json({ success: false, message: "Token inválido." });
    }

    const tokenExpirationTime = 3600000;
    if (Date.now() - timestamp > tokenExpirationTime) {
      return res
        .status(400)
        .json({ success: false, message: "El token ha expirado." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado." });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Contraseña actualizada correctamente.",
    });
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
    });
  }
};
