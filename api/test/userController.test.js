import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";
import { updateProfile } from "../controllers/userController.js";

jest.mock("../config/cloudinary.js");
jest.mock("../models/User.js");

describe("userController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("Actualizar perfil", () => {
    test("Actualizar perfil sin imagen", async () => {
      const mockUser = { _id: "user1", name: "Nuevo nombre" };
      User.findByIdAndUpdate.mockResolvedValue(mockUser);

      const req = {
        user: { id: "user1" },
        body: { name: "Nuevo nombre" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updateProfile(req, res);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        "user1",
        { name: "Nuevo nombre" },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        user: mockUser,
      });
    });

    test("Actualizar imagen con Cloudinary exitosamente", async () => {
      const mockImageUrl =
        "https://res.cloudinary.com/demo/image/upload/v1234.jpg";
      const mockUser = { _id: "user1", image: mockImageUrl };

      cloudinary.uploader.upload.mockResolvedValue({
        secure_url: mockImageUrl,
      });
      User.findByIdAndUpdate.mockResolvedValue(mockUser);

      const req = {
        user: { id: "user1" },
        body: {
          image: "data:image/png;base64,iVBORw0KGg...",
          bio: "Nueva bio",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updateProfile(req, res);

      expect(cloudinary.uploader.upload).toHaveBeenCalledWith(
        "data:image/png;base64,iVBORw0KGg..."
      );
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        "user1",
        { bio: "Nueva bio", image: mockImageUrl },
        { new: true }
      );
    });

    test("Retornar errror subida de imagen", async () => {
      cloudinary.uploader.upload.mockRejectedValue(new Error("Upload failed"));

      const req = {
        user: { id: "user1" },
        body: { image: "data:image/invalid" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updateProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Error uploading image",
      });
    });

    test("Retornar error del servidor", async () => {
      User.findByIdAndUpdate.mockRejectedValue(new Error("DB Error"));

      const req = {
        user: { id: "user1" },
        body: { name: "test" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updateProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Internal server error",
      });
    });
  });
});
