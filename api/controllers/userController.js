import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";

/**
 * @function updateProfile
 * @description Actualiza el perfil del usuario autenticado, incluyendo la subida de una nueva imagen a Cloudinary si se proporciona.
 * @route PUT /api/users/profile
 * @param {Object} req - Objeto de solicitud de Express que contiene los datos del usuario en `req.body` y el ID del usuario autenticado en `req.user.id`.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Objeto JSON con el usuario actualizado.
 * @throws {Error} - Devuelve error 400 si falla la subida de imagen, o error 500 si hay un fallo en el servidor.
 */
export const updateProfile = async (req, res) => {
  try {
    const { image, ...otherData } = req.body;

    let updatedData = otherData;

    if (image) {
      if (image.startsWith("data:image")) {
        try {
          const uploadResponse = await cloudinary.uploader.upload(image);
          updatedData.image = uploadResponse.secure_url;
        } catch (error) {
          console.error("Error uploading image:", uploadError);

          return res.status(400).json({
            success: false,
            message: "Error uploading image",
          });
        }
      }
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error in updateProfile: ", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
