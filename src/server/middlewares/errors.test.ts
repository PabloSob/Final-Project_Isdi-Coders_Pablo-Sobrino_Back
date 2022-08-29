import { Response, Request, NextFunction } from "express";
import ICustomError from "../../interfaces/errorInterfaces";
import { generalError, notFoundError } from "./errors";

describe("Given a notFoundError middleware", () => {
  describe("When it receives a response object", () => {
    const responseTest = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    const requestTest = {} as Partial<Request>;

    test("Then it should call the response method status with 404", () => {
      const status = 404;

      notFoundError(requestTest as Request, responseTest as Response);

      expect(responseTest.status).toHaveBeenCalledWith(status);
    });

    test("Then it should call the response method with a json object with an error property", () => {
      const ErrorResponse = { error: "Endpoint not found" };

      notFoundError(requestTest as Request, responseTest as Response);

      expect(responseTest.json).toHaveBeenCalledWith(ErrorResponse);
    });
  });
});

describe("Given an generalError function", () => {
  describe("When its called", () => {
    test("Then it should respond with a status code given by the error received and a message", async () => {
      const error = {
        code: 343,
        publicMessage: "General error",
      };
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(error.publicMessage),
      };
      const next = jest.fn();
      const status = 343;
      const resolvedJson = { error: error.publicMessage };

      await generalError(
        error as ICustomError,
        req as unknown as Request,
        res as unknown as Response,
        next as NextFunction
      );

      expect(res.status).toBeCalledWith(status);
      expect(res.json).toBeCalledWith(resolvedJson);
    });
  });
});
