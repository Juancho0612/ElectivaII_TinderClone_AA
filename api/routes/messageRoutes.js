import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  getConversation,
  sendMessage,
} from "../controllers/messageController.js";

const router = express.Router();

router.use(protectRoute);

/**
 * @swagger
 * /api/messages/send:
 *   post:
 *     summary: Envía un nuevo mensaje a otro usuario.
 *     description: >
 *       Permite al usuario autenticado enviar un mensaje a otro usuario.
 *       Si el receptor está conectado, el mensaje se envía en tiempo real mediante Socket.IO.
 *       Requiere autenticación mediante token JWT.
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Hola, ¿cómo estás?"
 *               receiverId:
 *                 type: string
 *                 example: "6657f8e8c7e1a2b3c4d5e6f7"
 *     responses:
 *       201:
 *         description: Mensaje enviado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   $ref: '#/components/schemas/Message'
 *       401:
 *         description: No autorizado. Token no proporcionado o inválido.
 *       500:
 *         description: Error en el servidor.
 */
router.post("/send", sendMessage);

/**
 * @swagger
 * /api/messages/conversation/{userId}:
 *   get:
 *     summary: Obtiene la conversación entre el usuario autenticado y otro usuario.
 *     description: >
 *       Devuelve todos los mensajes enviados entre el usuario autenticado y el usuario especificado por `userId`, ordenados por fecha de creación.
 *       Requiere autenticación mediante token JWT.
 *     tags:
 *       - Messages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario con el que se tiene la conversación.
 *     responses:
 *       200:
 *         description: Lista de mensajes obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 messages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *       401:
 *         description: No autorizado. Token no proporcionado o inválido.
 *       500:
 *         description: Error en el servidor.
 */
router.get("/conversation/:userId", getConversation);

export default router;
