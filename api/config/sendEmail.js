import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Envia un correo electrónico de recuperación de contraseña.
 * @param {string} to - Correo electrónico del destinatario.
 * @param {string} resetLink - Enlace para la recuperación de contraseña.
 * @returns {Promise} Promesa que se resuelve si el correo se envía correctamente.
 */
export const sendPasswordResetEmail = async (to, resetLink) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: "Recuperación de Contraseña",
      html: `
          <div style="font-family: Arial, sans-serif; background-color: #FF5864; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
              <h2 style="color: #333333; text-align: center; font-size: 24px;">Recuperación de Contraseña</h2>
              <p style="color: #555555; font-size: 16px; text-align: center;">Hola,</p>
              <p style="color: #555555; font-size: 16px;">Hemos recibido una solicitud para restablecer tu contraseña. Si no fuiste tú, puedes ignorar este correo. Si quieres restablecer tu contraseña, haz clic en el siguiente enlace:</p>
              <div style="text-align: center; margin-top: 20px;">
                <a href="${resetLink}" style="background-color: #FF5864; color: white; padding: 15px 25px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block; font-weight: bold; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); transition: background-color 0.3s;">Restablecer Contraseña</a>
              </div>
              <p style="color: #555555; font-size: 14px; margin-top: 20px; text-align: center;">Este enlace expirará en 1 horas.</p>
              <p style="color: #555555; font-size: 14px; margin-top: 10px; text-align: center;">Si no solicitaste este cambio, simplemente ignora este mensaje.</p>
              <p style="color: #888888; font-size: 12px; text-align: center; margin-top: 40px;">&copy; ${new Date().getFullYear()} Tinder</p>
            </div>
          </div>
        `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Correo de recuperación enviado.");
  } catch (error) {
    console.error("Error enviando el correo de recuperación:", error);
    throw new Error(
      "Error enviando el correo de recuperación: " + error.message
    );
  }
};
