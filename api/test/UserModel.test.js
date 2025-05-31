import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../models/User";

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
  await User.deleteMany();
});

describe("Modelo User", () => {
  it("debería crear y guardar un usuario correctamente", async () => {
    const userData = {
      name: "Juan",
      email: "juan@email.com",
      password: "12345678",
      age: 25,
      gender: "male",
      genderPreference: "female",
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(userData.name);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.age).toBe(userData.age);
    expect(savedUser.gender).toBe(userData.gender);
    expect(savedUser.genderPreference).toBe(userData.genderPreference);
    expect(savedUser.password).not.toBe(userData.password); // Debe estar encriptada
  });

  it("debería requerir los campos obligatorios", async () => {
    const user = new User({});
    let error;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.errors.name).toBeDefined();
    expect(error.errors.email).toBeDefined();
    expect(error.errors.password).toBeDefined();
    expect(error.errors.age).toBeDefined();
    expect(error.errors.gender).toBeDefined();
    expect(error.errors.genderPreference).toBeDefined();
  });

  it("debería encriptar la contraseña antes de guardar", async () => {
    const userData = {
      name: "Ana",
      email: "ana@email.com",
      password: "claveSegura",
      age: 22,
      gender: "female",
      genderPreference: "male",
    };

    const user = new User(userData);
    await user.save();

    expect(user.password).not.toBe(userData.password);
    expect(user.password.length).toBeGreaterThan(10);
  });

  it("debería validar el método matchPassword correctamente", async () => {
    const userData = {
      name: "Carlos",
      email: "carlos@email.com",
      password: "miPassword123",
      age: 30,
      gender: "male",
      genderPreference: "female",
    };

    const user = new User(userData);
    await user.save();

    const isMatch = await user.matchPassword("miPassword123");
    const isNotMatch = await user.matchPassword("otraClave");

    expect(isMatch).toBe(true);
    expect(isNotMatch).toBe(false);
  });

  it("no debe permitir emails duplicados", async () => {
    const userData = {
      name: "Pedro",
      email: "pedro@email.com",
      password: "clave123",
      age: 28,
      gender: "male",
      genderPreference: "female",
    };

    await new User(userData).save();

    let error;
    try {
      await new User(userData).save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.code).toBe(11000); 
  });
});