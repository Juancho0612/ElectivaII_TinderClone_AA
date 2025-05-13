import transporter from "./transporter.js";

//conecar con el controller este archivo
export const sendMessageEmail = async (to, senderName, message) => {
  const html = `
    <h2>Tienes un nuevo mensaje de ${senderName}</h2>
    <p>${message}</p>
    <p>¡Responde desde la app ahora!</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "📩 Nuevo mensaje en Tinder",
    html,
  });
};

export const sendMatchEmail = async (to, matchedName) => {
  const html = `
    <h2>🎉 ¡Has hecho match con ${matchedName}!</h2>
    <p>Conéctate ahora y empieza una conversación.</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "💘 ¡Nuevo Match!",
    html,
  });
};
