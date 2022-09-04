import { NextFunction, Request, Response } from "express";
import Crypto from "../../../database/models/Crypto";
import { ICrypto } from "../../../interfaces/cryptoInterface";
import CustomError from "../../../utils/CustomError";
import getAllCrypto from "./cryptoController";

describe("Given a getAllcrypto function", () => {
  const mockCrypto: ICrypto = {
    title: "cococoin",
    logo: "",
    description: "",
    team: 2,
    value: 4,
    ICO: new Date(),
  };

  const req = {} as Partial<Request>;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;

  const next = jest.fn() as NextFunction;

  describe("When it's called with a request, response and a next function", () => {
    test("Then it should response with a status 200", async () => {
      Crypto.find = jest.fn().mockReturnValue([mockCrypto]);

      const expectedStatus = 200;

      await getAllCrypto(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });

    test("Then it should respond with all the crypto found", async () => {
      const expectedResponse = {
        crypto: [mockCrypto],
      };

      await getAllCrypto(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("When called but doesn't return any valid data", () => {
    test("Then it should call next function with an error", async () => {
      Crypto.find = jest.fn().mockRejectedValue(new Error());

      const expectedError = new CustomError(
        404,
        "Error while getting crypto",
        "No crypto found"
      );

      await getAllCrypto(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When called but there are no crypto avaliable", () => {
    test("Then it should respond with 'Error while getting crypto' message", async () => {
      Crypto.find = jest.fn().mockReturnValue([]);

      const expectedError = { crypto: "No crypto found" };
      const status = 404;

      await getAllCrypto(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status);
      expect(res.json).toHaveBeenCalledWith(expectedError);
    });
  });
});