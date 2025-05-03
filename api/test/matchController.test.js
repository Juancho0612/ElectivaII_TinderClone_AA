import mongoose from "mongoose";
import {
  swipeRight,
  swipeLeft,
  getMatches,
  getUserProfiles,
} from "../controllers/matchController";
import User from "../models/User";
import { getConnectedUsers, getIO } from "../socket/socket.server";

jest.mock("../models/User");
jest.mock("../socket/socket.server");

describe("matchController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("swipe derecha", () => {
    test("Registra un like y genera un match si ambos usuarios se gustan", async () => {
      const user1Id = new mongoose.Types.ObjectId().toString();
      const user2Id = new mongoose.Types.ObjectId().toString();

      const mockCurrentUser = {
        _id: new mongoose.Types.ObjectId(user1Id),
        id: user1Id,
        likes: [],
        matches: [],
        save: jest.fn().mockImplementation(function () {
          this.likes.push(user2Id);
          return Promise.resolve(this);
        }),
      };

      const mockLikedUser = {
        _id: new mongoose.Types.ObjectId(user2Id),
        id: user2Id,
        likes: [user1Id],
        matches: [],
        save: jest.fn().mockImplementation(function () {
          this.matches.push(user1Id);
          return Promise.resolve(this);
        }),
      };

      User.findById
        .mockResolvedValueOnce(mockCurrentUser)
        .mockResolvedValueOnce(mockLikedUser);

      const connectedUsers = new Map([[user2Id, "socketId2"]]);
      getConnectedUsers.mockReturnValue(connectedUsers);

      const io = { to: jest.fn().mockReturnThis(), emit: jest.fn() };
      getIO.mockReturnValue(io);

      await swipeRight(
        {
          user: { id: user1Id },
          params: { likedUserId: user2Id },
        },
        {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
      );

      expect(mockCurrentUser.likes).toContain(user2Id);
      expect(mockCurrentUser.matches).toContain(user2Id);
      expect(mockLikedUser.matches).toContain(user1Id);

      expect(mockCurrentUser.save).toHaveBeenCalled();
      expect(mockLikedUser.save).toHaveBeenCalled();

      expect(io.to).toHaveBeenCalledWith("socketId2");
      expect(io.emit).toHaveBeenCalledWith("newMatch", {
        _id: mockCurrentUser._id,
        name: mockCurrentUser.name,
        image: mockCurrentUser.image,
      });
    });

    test("Verificar no creacion del match si no hay like", async () => {
      const user1Id = new mongoose.Types.ObjectId().toString();
      const user2Id = new mongoose.Types.ObjectId().toString();

      const mockCurrentUser = {
        _id: new mongoose.Types.ObjectId(user1Id),
        id: user1Id,
        likes: [],
        matches: [],
        save: jest.fn(),
      };

      const mockLikedUser = {
        _id: new mongoose.Types.ObjectId(user2Id),
        id: user2Id,
        likes: [],
        matches: [],
        save: jest.fn(),
      };

      User.findById
        .mockResolvedValueOnce(mockCurrentUser)
        .mockResolvedValueOnce(mockLikedUser);

      await swipeRight(
        {
          user: { id: user1Id },
          params: { likedUserId: user2Id },
        },
        {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
      );

      expect(mockCurrentUser.matches).toHaveLength(0);
      expect(mockCurrentUser.save).toHaveBeenCalledTimes(1);
    });

    test("Veridicar si el usuario existe", async () => {
      User.findById.mockResolvedValueOnce(null);

      const req = {
        user: { id: "user1" },
        params: { likedUserId: "user2" },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await swipeRight(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Usuario no encontrado",
      });
    });

    test("Verificar usurios conectados para emitir websocket", async () => {
      const user1Id = new mongoose.Types.ObjectId().toString();
      const user2Id = new mongoose.Types.ObjectId().toString();

      const mockCurrentUser = {
        _id: new mongoose.Types.ObjectId(user1Id),
        id: user1Id,
        likes: [],
        matches: [],
        save: jest.fn(),
      };

      const mockLikedUser = {
        _id: new mongoose.Types.ObjectId(user2Id),
        id: user2Id,
        likes: [user1Id],
        matches: [],
        save: jest.fn(),
      };

      User.findById
        .mockResolvedValueOnce(mockCurrentUser)
        .mockResolvedValueOnce(mockLikedUser);

      getConnectedUsers.mockReturnValue(new Map());

      const io = { to: jest.fn(), emit: jest.fn() };
      getIO.mockReturnValue(io);

      await swipeRight(
        {
          user: { id: user1Id },
          params: { likedUserId: user2Id },
        },
        {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
      );

      expect(io.emit).not.toHaveBeenCalled();
    });
  });

  describe("swipe izquierda", () => {
    test("Registra un dislike correctamente", async () => {
      const mockCurrentUser = {
        _id: "user1",
        dislikes: [],
        save: jest.fn(),
      };

      User.findById.mockResolvedValue(mockCurrentUser);

      const req = {
        user: { id: "user1" },
        params: { dislikedUserId: "user2" },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await swipeLeft(req, res);

      expect(mockCurrentUser.dislikes).toContain("user2");
      expect(mockCurrentUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        user: mockCurrentUser,
      });
    });

    test("Verificar si el usuario existe", async () => {
      User.findById.mockResolvedValueOnce({}).mockResolvedValueOnce(null);

      const req = {
        user: { id: "user1" },
        params: { likedUserId: "user_invalido" },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await swipeRight(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Usuario no encontrado",
      });
    });

    test("retornar error del servidor en consulta db", async () => {
      User.findById.mockRejectedValue(new Error("DB Error"));

      const req = {
        user: { id: "user1" },
        params: { dislikedUserId: "user2" },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await swipeLeft(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });

    test("Verificar dislike existente", async () => {
      const user1Id = new mongoose.Types.ObjectId().toString();
      const user2Id = new mongoose.Types.ObjectId().toString();

      const mockCurrentUser = {
        _id: new mongoose.Types.ObjectId(user1Id),
        id: user1Id,
        dislikes: [user2Id],
        save: jest.fn(),
      };

      User.findById.mockResolvedValue(mockCurrentUser);

      await swipeLeft(
        {
          user: { id: user1Id },
          params: { dislikedUserId: user2Id },
        },
        {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
      );

      expect(mockCurrentUser.dislikes).toHaveLength(1);
      expect(mockCurrentUser.save).not.toHaveBeenCalled();
    });
  });

  describe("Obtener maches", () => {
    test("Devuelve los matches del usuario autenticado", async () => {
      User.findById.mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue({
          _id: "user1",
          matches: [{ _id: "user2", name: "User 2", image: "image2.jpg" }],
        }),
      }));

      const req = {
        user: { id: "user1" },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getMatches(req, res);

      expect(User.findById).toHaveBeenCalledWith("user1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        matches: [{ _id: "user2", name: "User 2", image: "image2.jpg" }],
      });
    });
  });

  describe("Obtener perfiles de usuario", () => {
    test("Retornar perfiles disponibles según las preferencias del usuario", async () => {
      const mockCurrentUser = {
        _id: "user1",
        likes: ["user2"],
        dislikes: ["user3"],
        matches: ["user4"],
        genderPreference: "female",
        gender: "male",
      };

      const mockUsers = [
        { _id: "user5", name: "User 5", gender: "female" },
        { _id: "user6", name: "User 6", gender: "female" },
      ];

      User.findById.mockResolvedValue(mockCurrentUser);
      User.find.mockResolvedValue(mockUsers);

      const req = {
        user: { id: "user1" },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getUserProfiles(req, res);

      expect(User.findById).toHaveBeenCalledWith("user1");
      expect(User.find).toHaveBeenCalledWith(expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        users: mockUsers,
      });
    });
  });
});
