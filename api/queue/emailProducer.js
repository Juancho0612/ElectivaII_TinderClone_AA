import { emailQueue } from "./emailQueue.js";

export const enqueueEmailNotification = async (type, data) => {
  try {
    await emailQueue.add(type, data);
    console.log("Correo agregado a la cola.");
  } catch (error) {
    console.error("Error al agregar trabajo a la cola:", error);
  }
};
