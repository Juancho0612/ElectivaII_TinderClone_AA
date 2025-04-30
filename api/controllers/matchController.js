import User from "../models/User.js";
import { getConnectedUsers, getIO } from "../socket/socket.server.js";

/**
 * @function swipeRight
 * @description Registra un "like" del usuario autenticado hacia otro usuario. Si ambos usuarios se han dado "like", se genera un match.
 * @route POST /api/swipe/right/:likedUserId
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Devuelve el usuario actualizado y, si hay match, emite un evento por WebSocket.
 */
export const swipeRight = async (req, res) => {
  try {
    const { likedUserId } = req.params;
    const currentUser = await User.findById(req.user.id);
    const likedUser = await User.findById(likedUserId);

    if (!likedUser) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    if (!currentUser.likes.includes(likedUserId)) {
      currentUser.likes.push(likedUserId);
      await currentUser.save();

      // Si el usuario 'likedUser' también ha dado like a 'currentUser', hacemos un match
      if (likedUser.likes.includes(currentUser.id)) {
        currentUser.matches.push(likedUserId);
        likedUser.matches.push(currentUser.id);

        await Promise.all([currentUser.save(), likedUser.save()]);

        const connectedUsers = getConnectedUsers();
        const io = getIO();

        // Emitir eventos de WebSocket para los matches
        const likedUserSocketId = connectedUsers.get(likedUserId);
        if (likedUserSocketId) {
          io.to(likedUserSocketId).emit("newMatch", {
            _id: currentUser._id,
            name: currentUser.name,
            image: currentUser.image,
          });
        }

        const currentSocketId = connectedUsers.get(currentUser._id.toString());
        if (currentSocketId) {
          io.to(currentSocketId).emit("newMatch", {
            _id: likedUser._id,
            name: likedUser.name,
            image: likedUser.image,
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      user: currentUser,
    });
  } catch (error) {
    console.log("error en swipeRight: ", error);

    res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
};

/**
 * @function swipeLeft
 * @description Registra un "dislike" del usuario autenticado hacia otro usuario.
 * @route POST /api/swipe/left/:dislikedUserId
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Devuelve el usuario actualizado con el nuevo "dislike".
 */
export const swipeLeft = async (req, res) => {
  try {
    const { dislikedUserId } = req.params;
    const currentUser = await User.findById(req.user.id);

    // Si no está en la lista de dislikes, lo añadimos
    if (!currentUser.dislikes.includes(dislikedUserId)) {
      currentUser.dislikes.push(dislikedUserId);
      await currentUser.save();
    }

    res.status(200).json({
      success: true,
      user: currentUser,
    });
  } catch (error) {
    console.log("Error en swipeLeft: ", error);

    res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
};

/**
 * @function getMatches
 * @description Obtiene todos los matches del usuario autenticado, incluyendo nombre e imagen del usuario emparejado.
 * @route GET /api/matches
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Lista de usuarios que hicieron match con el usuario actual.
 */
export const getMatches = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "matches",
      "name image"
    );

    res.status(200).json({
      success: true,
      matches: user.matches,
    });
  } catch (error) {
    console.log("Error en getMatches: ", error);

    res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
};

/**
 * @function getUserProfiles
 * @description Devuelve una lista de perfiles disponibles para mostrar al usuario actual, excluyendo ya vistos, con base en preferencias de género.
 * @route GET /api/users/profiles
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Lista de usuarios que cumplen con los criterios de búsqueda del usuario actual.
 */
export const getUserProfiles = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    const users = await User.find({
      $and: [
        { _id: { $ne: currentUser.id } },
        { _id: { $nin: currentUser.likes } },
        { _id: { $nin: currentUser.dislikes } },
        { _id: { $nin: currentUser.matches } },
        {
          gender:
            currentUser.genderPreference === "both"
              ? { $in: ["male", "female"] }
              : currentUser.genderPreference,
        },
        { genderPreference: { $in: [currentUser.gender, "both"] } },
      ],
    });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log("Error en getUserProfiles: ", error);

    res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
};
