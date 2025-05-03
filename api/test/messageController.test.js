import { getConnectedUsers, getIO } from "../socket/socket.server.js";
import {
  sendMessage,
  getConversation,
} from "../controllers/messageController.js";
import Message from "../models/Message.js";

jest.mock("../models/Message.js");
jest.mock("../socket/socket.server.js");

describe("messageController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("Enviar mensaje", () => {
    test("Enviar mensaje y emitir por WebSocket si el receptor esta conectado", async () => {
      const mockMessage = {
        _id: "msg1",
        sender: "user1",
        receiver: "user2",
        content: "Hola",
        createdAt: new Date(),
      };

      Message.create.mockResolvedValue(mockMessage);
      const connectedUsers = new Map([["user2", "socket123"]]);
      getConnectedUsers.mockReturnValue(connectedUsers);
      const ioMock = { to: jest.fn().mockReturnThis(), emit: jest.fn() };
      getIO.mockReturnValue(ioMock);

      const req = {
        user: { id: "user1" },
        body: { content: "Hola", receiverId: "user2" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await sendMessage(req, res);

      expect(Message.create).toHaveBeenCalledWith({
        sender: "user1",
        receiver: "user2",
        content: "Hola",
      });
      expect(ioMock.to).toHaveBeenCalledWith("socket123");
      expect(ioMock.emit).toHaveBeenCalledWith("newMessage", {
        message: mockMessage,
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test("enviar mensaje sin emitir si el receptor esta desconectado", async () => {
      Message.create.mockResolvedValue({});
      getConnectedUsers.mockReturnValue(new Map());

      await sendMessage(
        {
          user: { id: "user1" },
          body: { receiverId: "user2", content: "Test" },
        },
        {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
      );

      expect(getIO().emit).not.toHaveBeenCalled();
    });

    test("retornar error del servidor", async () => {
      Message.create.mockRejectedValue(new Error("DB Error"));

      const req = {
        user: { id: "user1" },
        body: { receiverId: "user2", content: "Error" },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await sendMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Error en el servidor",
      });
    });
  });

  describe("Obtener conversacion", () => {
    test("Obtener conversación entre dos usuarios", async () => {
      const mockMessages = [
        { content: "Hola", sender: "user1" },
        { content: "Adiós", sender: "user2" },
      ];

      Message.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockMessages),
      });

      const req = {
        user: { _id: "user1" },
        params: { userId: "user2" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getConversation(req, res);

      expect(Message.find).toHaveBeenCalledWith({
        $or: [
          { sender: "user1", receiver: "user2" },
          { sender: "user2", receiver: "user1" },
        ],
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        messages: mockMessages,
      });
    });

    test("retornar erro del servidor al obtner conversacion", async () => {
      Message.find.mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error("DB Error")),
      });

      const req = {
        user: { _id: "user1" },
        params: { userId: "user2" },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getConversation(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Error en el servidor",
      });
    });
  });
});
