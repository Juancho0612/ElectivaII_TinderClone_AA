import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protectRoute } from "../middleware/auth.js";

jest.mock("jsonwebtoken");
jest.mock("../models/User.js");

describe("Middleware protectRoute", () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});

    mockReq = {
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("Validar existencia del token", async () => {
    await protectRoute(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: "Not authorized - No token provided",
    });
  });

  test("Validar si el token es valido", async () => {
    mockReq.headers.authorization = "Bearer invalidtoken";
    jwt.verify.mockImplementation(() => {
      throw new jwt.JsonWebTokenError("Invalid token");
    });

    await protectRoute(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: "No autorizado - token invalido",
    });
  });

  test("Verificar si el usurio existe", async () => {
    mockReq.headers.authorization = "Bearer validtoken";
    jwt.verify.mockReturnValue({ id: "userNoExistente" });
    User.findById.mockResolvedValue(null);

    await protectRoute(mockReq, mockRes, mockNext);

    expect(User.findById).toHaveBeenCalledWith("userNoExistente");
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: "No autorizado - Usuario no encontrado",
    });
  });

  test("Verificar usurio, token y permitir acceso", async () => {
    const mockUser = { _id: "user1", name: "Test User" };
    mockReq.headers.authorization = "Bearer validtoken";
    jwt.verify.mockReturnValue({ id: "user1" });
    User.findById.mockResolvedValue(mockUser);

    await protectRoute(mockReq, mockRes, mockNext);

    expect(mockReq.user).toEqual(mockUser);
    expect(mockNext).toHaveBeenCalled();
  });

  test("Retornar error del servidor", async () => {
    mockReq.headers.authorization = "Bearer validtoken";
    User.findById.mockRejectedValue(new Error("DB Error"));

    await protectRoute(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: "Error en el servidor",
    });
  });
});
