import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../..";
import connectDB from "../../../database";
import Crypto from "../../../database/models/Crypto";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoURL = mongoServer.getUri();

  await connectDB(mongoURL);
});

afterEach(async () => {
  await Crypto.deleteMany({});
});

afterAll(async () => {
  mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given a GET endpoint", () => {
  describe("When it receives a request crypto method get", () => {
    test("Then it should response with status 200", async () => {
      const expectedStatus = 200;

      await Crypto.create({
        title: "cococoin",
        logo: "crypto.png",
        description: "a great crypto",
        team: 2,
        value: 4,
        ICO: new Date(),
      });

      await request(app).get("/crypto").expect(expectedStatus);
    });
  });

  describe("When it receives a request with method get but there isn't any object on the database", () => {
    test("Then it should throw a 'No crypto found' error", async () => {
      const expectedStatus = 200;

      await request(app).get("/crypto").expect(expectedStatus);
    });
  });
});
