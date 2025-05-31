import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { updateProfile } from "../controllers/userController.js";

const router = express.Router();

/**
 * @swagger
 * /api/users/update:
 *   put:
 *     summary: Actualiza el perfil del usuario autenticado.
 *     description: >
 *       Permite al usuario autenticado actualizar su perfil, incluyendo la subida de una nueva imagen a Cloudinary si se proporciona una imagen en base64.
 *       Solo los campos enviados en el cuerpo serán actualizados.
 *       Requiere autenticación mediante token JWT.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Juan"
 *               age:
 *                 type: integer
 *                 example: 23
 *               gender:
 *                 type: string
 *                 example: "male"
 *               genderPreference:
 *                 type: string
 *                 example: "female"
 *               image:
 *                 type: string
 *                 example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
 *     responses:
 *       200:
 *         description: Perfil actualizado correctamente.
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
 *       400:
 *         description: Error al subir la imagen.
 *       401:
 *         description: No autorizado. Token no proporcionado o inválido.
 *       500:
 *         description: Error interno del servidor.
 */
router.put("/update", protectRoute, updateProfile);

export default router;
