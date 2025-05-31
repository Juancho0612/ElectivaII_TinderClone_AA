import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { getMatches, getUserProfiles, swipeLeft, swipeRight } from "../controllers/matchController.js";

const router = express.Router();

/**
 * @swagger
 * /api/matches/swipe-right/{likedUserId}:
 *   post:
 *     summary: Da like a un usuario y genera match si es mutuo.
 *     description: >
 *       Permite al usuario autenticado dar "like" a otro usuario. Si el usuario al que se le da "like" también ha dado "like" previamente, se genera un match entre ambos usuarios y se emite un evento por WebSocket.  
 *       Requiere autenticación mediante token JWT.
 *     tags:
 *       - Matches
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: likedUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario al que se le da like.
 *     responses:
 *       200:
 *         description: Like registrado correctamente. Si hay match, se devuelve el usuario actualizado y se emite un evento.
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
 *       404:
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Usuario no encontrado
 *       401:
 *         description: No autorizado. Token no proporcionado o inválido.
 *       500:
 *         description: Error en el servidor.
 */
router.post("/swipe-right/:likedUserId", protectRoute, swipeRight);

/**
 * @swagger
 * /api/matches/swipe-left/{dislikedUserId}:
 *   post:
 *     summary: Da dislike a un usuario.
 *     description: >
 *       Permite al usuario autenticado registrar un "dislike" hacia otro usuario. El usuario marcado como "dislike" no volverá a aparecer en las sugerencias.  
 *       Requiere autenticación mediante token JWT.
 *     tags:
 *       - Matches
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dislikedUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario al que se le da dislike.
 *     responses:
 *       200:
 *         description: Dislike registrado correctamente.
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
 *       500:
 *         description: Error en el servidor.
 */
router.post("/swipe-left/:dislikedUserId", protectRoute, swipeLeft);

/**
 * @swagger
 * /api/matches/matches:
 *   get:
 *     summary: Obtiene los matches del usuario autenticado.
 *     description: >
 *       Devuelve una lista de usuarios con los que el usuario autenticado ha hecho match.  
 *       Incluye información básica como nombre e imagen de perfil.  
 *       Requiere autenticación mediante token JWT.
 *     tags:
 *       - Matches
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de matches obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 matches:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado. Token no proporcionado o inválido.
 *       500:
 *         description: Error en el servidor.
 */
router.get("/", protectRoute, getMatches);

/**
 * @swagger
 * /api/matches/user-profiles:
 *   get:
 *     summary: Obtiene perfiles de usuario disponibles para mostrar.
 *     description: >
 *       Devuelve una lista de perfiles de usuario que cumplen con los criterios de búsqueda del usuario autenticado, excluyendo los ya vistos (likes, dislikes, matches) y filtrando por preferencias de género.  
 *       Requiere autenticación mediante token JWT.
 *     tags:
 *       - Matches
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de perfiles disponibles obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado. Token no proporcionado o inválido.
 *       500:
 *         description: Error en el servidor.
 */
router.get("/user-profiles", protectRoute, getUserProfiles);

export default router;