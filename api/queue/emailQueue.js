import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { Queue, Worker } from "bullmq";

dotenv.config();

// Configuración de conexión a Redis para BullMQ
const connection = {
  host: "redis-11217.c326.us-east-1-3.ec2.redns.redis-cloud.com",
  port: 11217,
  username: "default",
  password: "oM9PmeLVPQVojGWhcejOvX33MIs9giGZ",
};


// Crear la cola para las notificaciones por correo
const emailQueue = new Queue("email-notifications", {
  connection,
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Función para enviar el correo --revisar
const sendEmail = async (to, subject, content) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: content,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Correo enviado a ${to}`);
  } catch (error) {
    console.error("Error al enviar correo:", error);
  }
};

const emailWorker = new Worker(
  "email-notifications",
  async (job) => {
    const { type, data } = job.data;

    console.log(`Procesando trabajo: ${type}`);

    if (type === "message") {
      const { to, senderName, message } = data;
      await sendEmail(
        to,
        "Nuevo mensaje",
        `${senderName} te envió un mensaje: "${message}"`
      );
    }

    return { status: "processed" };
  },
  {
    connection,
  }
);

emailWorker.on("completed", (job) => {
  console.log(`Trabajo completado: ${job.id}`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`Trabajo fallido: ${job.id}`, err);
});

export { emailQueue };
