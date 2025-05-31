import express from "express";
import {
  signup,
  login,
  logout,
  resetPassword,
  updatePassword,
} from "../controllers/authController.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Registra un nuevo usuario.
 *     description: >
 *       Registra un nuevo usuario en la base de datos y retorna un token JWT.
 *       Requiere nombre, correo, contraseña, edad, género y preferencia de género.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - age
 *               - gender
 *               - genderPreference
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Juan"
 *               email:
 *                 type: string
 *                 example: "juan@email.com"
 *               password:
 *                 type: string
 *                 example: "12345678"
 *               age:
 *                 type: integer
 *                 example: 22
 *               gender:
 *                 type: string
 *                 example: "male"
 *               genderPreference:
 *                 type: string
 *                 example: "female"
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       400:
 *         description: Error de validación o correo duplicado.
 *       500:
 *         description: Error en el servidor.
 */
router.post("/signup", signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión de usuario.
 *     description: >
 *       Autentica a un usuario con correo y contraseña, y devuelve un token JWT si las credenciales son válidas.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "juan@email.com"
 *               password:
 *                 type: string
 *                 example: "12345678"
 *     responses:
 *       200:
 *         description: Usuario autenticado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       400:
 *         description: Faltan campos requeridos.
 *       401:
 *         description: Credenciales inválidas.
 *       500:
 *         description: Error en el servidor.
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cierra la sesión del usuario.
 *     description: Finaliza la sesión del usuario y devuelve un mensaje de éxito.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Ingreso correctamente
 */
router.post("/logout", logout);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Solicita restablecimiento de contraseña.
 *     description: >
 *       Recibe un correo electrónico, verifica si el usuario existe y envía un correo para restablecer la contraseña.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "juan@email.com"
 *     responses:
 *       200:
 *         description: Correo de recuperación enviado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Correo de recuperación enviado.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error al enviar el correo.
 */
router.post("/reset-password", resetPassword);

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Cambia la contraseña del usuario.
 *     description: >
 *       Actualiza la contraseña del usuario.
 *       Verifica si el token es válido y actualiza la contraseña en la base de datos.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resetToken
 *               - newPassword
 *             properties:
 *               resetToken:
 *                 type: string
 *                 example: "ZXhhbXBsZUBtYWlsLmNvbSwyMTYyODg2MDAwMDAw"
 *               newPassword:
 *                 type: string
 *                 example: "nuevaClave123"
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Contraseña actualizada correctamente.
 *       400:
 *         description: Token inválido, expirado o faltan datos.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/change-password", updatePassword);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtiene el usuario autenticado.
 *     description: Devuelve los datos del usuario autenticado mediante el token JWT.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario autenticado obtenido correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado. Token no proporcionado o inválido.
 */
router.get("/me", protectRoute, (req, res) => {
  res.send({
    success: true,
    user: req.user,
  });
});

export default router;
