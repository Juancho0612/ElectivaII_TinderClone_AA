import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Message from "../models/Message";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: "test" });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Message.deleteMany();
});

describe("Modelo Message", () => {
  it("debería guardar un mensaje correctamente", async () => {
    const senderId = new mongoose.Types.ObjectId();
    const receiverId = new mongoose.Types.ObjectId();

    const msg = new Message({
      sender: senderId,
      receiver: receiverId,
      content: "¡Hola!",
    });

    const savedMsg = await msg.save();

    expect(savedMsg._id).toBeDefined();
    expect(savedMsg.sender).toEqual(senderId);
    expect(savedMsg.receiver).toEqual(receiverId);
    expect(savedMsg.content).toBe("¡Hola!");
    expect(savedMsg.createdAt).toBeDefined();
    expect(savedMsg.updatedAt).toBeDefined();
  });

  it("debería requerir los campos obligatorios", async () => {
    const msg = new Message({});
    let error;
    try {
      await msg.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.errors.sender).toBeDefined();
    expect(error.errors.receiver).toBeDefined();
    expect(error.errors.content).toBeDefined();
  });
});