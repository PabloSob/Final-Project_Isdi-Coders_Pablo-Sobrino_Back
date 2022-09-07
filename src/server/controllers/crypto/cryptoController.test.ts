import { NextFunction, Request, Response } from "express";
import Crypto from "../../../database/models/Crypto";
import { ICrypto } from "../../../interfaces/cryptoInterface";
import CustomError from "../../../utils/CustomError";
import { getAllCrypto, deleteCrypto } from "./cryptoController";

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
});

describe("Given a deleteCrypto function", () => {
  describe("When it's called with a request, response and a next function", () => {
    test("Then it should respond with with a status 200 and a confirmation of delete with a message 'Crypto deleted correctly'", async () => {
      const requestTest = {
        params: { id: "62e0ajh9b455361" },
      } as Partial<Request>;

      const expectedStatus = 200;
      const expectedMessage = { message: "Crypto deleted correctly" };
      const next = jest.fn() as NextFunction;

      const responseTest = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as Partial<Response>;

      Crypto.findByIdAndDelete = jest.fn().mockResolvedValue(expectedMessage);

      await deleteCrypto(
        requestTest as Request,
        responseTest as Response,
        next
      );

      expect(responseTest.status).toHaveBeenCalledWith(expectedStatus);
      expect(responseTest.json).toHaveBeenCalledWith(expectedMessage);
    });

    describe("When it receives a request to delete an item but can't find it", () => {
      test("Then it should throw a CustomError with 404 as code", async () => {
        const requestTest = {
          params: { id: "" },
        } as Partial<Request>;

        const expectedError = new CustomError(
          404,
          "Error while deleting crypto",
          "Error while deleting crypto"
        );

        Crypto.findByIdAndDelete = jest.fn().mockRejectedValue(expectedError);

        const next = jest.fn() as NextFunction;

        const responseTest = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        } as Partial<Response>;

        await deleteCrypto(
          requestTest as Request,
          responseTest as Response,
          next
        );

        expect(next).toHaveBeenCalledWith(expectedError);
      });
    });
  });
});
