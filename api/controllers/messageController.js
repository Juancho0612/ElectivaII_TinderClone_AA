import Message from "../models/Message.js";
import { getConnectedUsers, getIO } from "../socket/socket.server.js";
import { enqueueEmailNotification } from "../queue/emailProducer.js";

/**
 * @function sendMessage
 * @description Envía un nuevo mensaje de un usuario a otro y emite el mensaje en tiempo real mediante Socket.IO si el receptor está conectado.
 * @route POST /api/messages
 * @param {Object} req - Objeto de solicitud de Express que contiene `content` y `receiverId` en el cuerpo.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Objeto JSON con el mensaje creado.
 * @throws {Error} - Devuelve un error 500 si ocurre un fallo en la base de datos o envío de mensaje.
 */
export const sendMessage = async (req, res) => {
  try {
    const { content, receiverId } = req.body;

    const newMessage = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      content,
    });

    const io = getIO();
    const connectedUsers = getConnectedUsers();
    const receiverSocketId = connectedUsers.get(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", {
        message: newMessage,
      });
    }

    //pasar info real a la cola --revisar
     await enqueueEmailNotification("message", {
      to: "higuta47@gmail.com",  
      senderName: "prueba aleja",  
      message: content,
    });

    res.status(201).json({
      success: true,
      message: newMessage,
    });
  } catch (error) {
    console.log("Error En sendMessage: ", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
};

/**
 * @function getConversation
 * @description Obtiene todos los mensajes enviados entre el usuario autenticado y otro usuario especificado.
 * @route GET /api/messages/:userId
 * @param {Object} req - Objeto de solicitud de Express con el `userId` como parámetro de ruta.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Objeto JSON con la lista de mensajes ordenados por fecha de creación.
 * @throws {Error} - Devuelve un error 500 si ocurre un fallo en la consulta.
 */
export const getConversation = async (req, res) => {
  const { userId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    }).sort("createdAt");

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log("Error en getConversation: ", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
};
