import jwt from "jsonwebtoken";
import {
  signup,
  login,
  resetPassword,
  updatePassword,
} from "../controllers/authController";
import User from "../models/User";
import { sendPasswordResetEmail } from "../config/sendEmail";

jest.mock("../models/User");
jest.mock("jsonwebtoken");
jest.mock("../config/sendEmail");

describe("authController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("Registro", () => {

    test("Registro exitoso de usuario", async () => {
      const mockUser = {
        _id: "123",
        name: "Test",
        email: "test@example.com",
        age: 25,
        gender: "male",
        genderPreference: "female",
      };
    
      User.create.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue("mocked-token");
    
      const req = {
        body: {
          name: "Test",
          email: "test@example.com",
          password: "password123",
          age: 25,
          gender: "male",
          genderPreference: "female",
        },
      };
    
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    
      await signup(req, res);
    
      expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
        name: "Test",
        email: "test@example.com",
        password: "password123",
        age: 25,
        gender: "male",
        genderPreference: "female",
      }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        user: mockUser,
        token: "mocked-token",
      });
    });
    
    test("Verificar campos requeridos", async () => {
      const req = {
        body: {
          email: "test@example.com",
          password: "password123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Todos los campos son requeridos",
      });
    });

    test("Verificar usuario existente", async () => {
      User.create.mockImplementation(() => {
        const error = new Error("Duplicate key error");
        error.code = 11000;
        error.keyPattern = { email: 1 };
        throw error;
      });

      const req = {
        body: {
          name: "Test",
          email: "test@example.com",
          password: "password123",
          age: 25,
          gender: "male",
          genderPreference: "female",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "El correo eletronico ya existe",
      });
    });

    test("Verificar si la contraseña es muy corta", async () => {
      const req = {
        body: {
          name: "Test",
          email: "test@example.com",
          password: "123",
          age: 25,
          gender: "male",
          genderPreference: "female",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "La contraseña debe ser de 8 caracteres",
      });
    });
    
  });

  describe("Inicio de sesión", () => {
    test("Verificar campos requeridos", async () => {
      const req = {
        body: { email: "test@example.com" }, 
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Todos los campos son requeridos",
      });
    });

    test("Verificar si el usuario no existe", async () => {
      User.findOne.mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(null),
      }));

      const req = {
        body: { email: "test@example.com", password: "password123" },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Correo o contraseña invalidos",
      });
    });

    test("Verificar si la contraseña es incorrecta", async () => {
      const mockUserWithWrongPass = {
        email: "test@example.com",
        matchPassword: jest.fn().mockResolvedValue(false),
      };

      User.findOne.mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(mockUserWithWrongPass),
      }));

      const req = {
        body: { email: "test@example.com", password: "wrongpassword" },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Correo o contraseña invalidos",
      });
    });

    test("Autenticar usuario y devolver un token si las credenciales son válidas", async () => {
      const mockValidUser = {
        _id: "123",
        email: "test@example.com",
        matchPassword: jest.fn().mockResolvedValue(true),
      };

      User.findOne.mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(mockValidUser),
      }));

      jwt.sign.mockReturnValue("mocked-jwt-token");

      const req = {
        body: { email: "test@example.com", password: "password123" },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        user: mockValidUser,
        token: "mocked-jwt-token",
      });
    });

    test("Retornar un error 500 si ocurre un error del servidor", async () => {
      User.findOne.mockImplementation(() => {
        throw new Error("Error del servidor");
      });

      const req = {
        body: { email: "test@example.com", password: "password123" },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Error en el servidor",
      });
    });

    
  });

  describe("Recuperar contraseña", () => {
    test("Verificar si el usuario no existe", async () => {
      User.findOne.mockResolvedValue(null);

      const req = {
        body: { email: "nonexistent@example.com" },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "No se encontró una cuenta con ese correo electrónico.",
      });
    });

    test("Enviar un correo de recuperación si el usuario existe", async () => {
      User.findOne.mockResolvedValue({ email: "test@example.com" });
      sendPasswordResetEmail.mockResolvedValue();

      const req = {
        body: { email: "test@example.com" },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await resetPassword(req, res);

      expect(sendPasswordResetEmail).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Correo de recuperación enviado.",
      });
    });

    test("retornar un error si la edad es menor a 18 años", async () => {
      const req = {
        body: {
          name: "Test",
          email: "test@example.com",
          password: "password123",
          age: 17,
          gender: "male",
          genderPreference: "female",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Debe ser mayor de 18 años",
      });
    });

    test("Retornar un error 500 si ocurre un error del servidor en el registro", async () => {
      User.create.mockImplementation(() => {
        throw new Error("Error del servidor");
      });

      const req = {
        body: {
          name: "Test",
          email: "test@example.com",
          password: "password123",
          age: 25,
          gender: "male",
          genderPreference: "female",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Error en el servidor",
      });
    });

    test("Devolver un error 500 si ocurre un error al enviar el correo", async () => {
      User.findOne.mockResolvedValue({ email: "test@example.com" });
      sendPasswordResetEmail.mockImplementation(() => {
        throw new Error("Error al enviar el correo");
      });

      const req = {
        body: { email: "test@example.com" },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Error al enviar el correo.",
      });
    });
  });

  describe("Actualizar contraseña", () => {
    test("Verificar token", async () => {
      const req = {
        body: { resetToken: "invalid-token", newPassword: "newpassword123" },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Token inválido.",
      });
    });

    test("Actualizar la contraseña si el token es válido", async () => {
      const mockUser = {
        email: "test@example.com",
        save: jest.fn(),
      };

      User.findOne.mockResolvedValue(mockUser);

      const validToken = Buffer.from(
        JSON.stringify({ email: "test@example.com", timestamp: Date.now() })
      ).toString("base64");

      const req = {
        body: { resetToken: validToken, newPassword: "newpassword123" },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updatePassword(req, res);

      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Contraseña actualizada correctamente.",
      });
    });

    test("Verificar si el token expiró", async () => {
      const expiredToken = Buffer.from(
        JSON.stringify({
          email: "test@example.com",
          timestamp: Date.now() - 3600001,
        })
      ).toString("base64");

      const req = {
        body: { resetToken: expiredToken, newPassword: "newpassword123" },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "El token ha expirado.",
      });
    });

    test("Verificar si existe el usurio", async () => {
      User.findOne.mockResolvedValue(null);

      const validToken = Buffer.from(
        JSON.stringify({ email: "test@example.com", timestamp: Date.now() })
      ).toString("base64");

      const req = {
        body: { resetToken: validToken, newPassword: "newpassword123" },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Usuario no encontrado.",
      });
    });

    test("Devolver un error 500 si ocurre un error del servidor", async () => {
      User.findOne.mockImplementation(() => {
        throw new Error("Error del servidor");
      });

      const validToken = Buffer.from(
        JSON.stringify({ email: "test@example.com", timestamp: Date.now() })
      ).toString("base64");

      const req = {
        body: { resetToken: validToken, newPassword: "newpassword123" },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Error interno del servidor.",
      });
    });
  });
});
