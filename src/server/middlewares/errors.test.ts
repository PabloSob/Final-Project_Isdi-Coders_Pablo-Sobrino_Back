import { Response, Request, NextFunction } from "express";
import CustomError from "../../utils/CustomError";
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
  const req = {};
  const next = jest.fn();
  describe("When it's called", () => {
    test("Then it should response with a status with the received error code and an error message", async () => {
      const error: CustomError = {
        publicMessage: "General error",
        code: "",
        message: "",
        name: "",
        statusCode: 333,
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue(error.publicMessage),
      };

      const status = 333;
      const responseJson = { error: error.publicMessage };

      await generalError(
        error as CustomError,
        req as unknown as Request,
        res as unknown as Response,
        next as NextFunction
      );

      expect(res.status).toBeCalledWith(status);
      expect(res.json).toBeCalledWith(responseJson);
    });

    describe("When it's called with a status code null", () => {
      test("Then it should respond with a status code 500", async () => {
        const error: CustomError = {
          publicMessage: "",
          code: "",
          message: "",
          name: "",
          statusCode: null,
        };

        const requestTest = {};
        const responseTest = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockResolvedValue(error.publicMessage),
        };

        const nextTest = jest.fn();

        const expectedStatus = 500;

        await generalError(
          error as CustomError,
          requestTest as unknown as Request,
          responseTest as unknown as Response,
          nextTest as NextFunction
        );

        expect(responseTest.status).toBeCalledWith(expectedStatus);
      });
      describe("When it is instantiated with a publicMessage null", () => {
        test("Then it should give a response with the public message 'General error'", async () => {
          const error: CustomError = {
            publicMessage: null,
            code: "",
            message: "",
            name: "",
            statusCode: 500,
          };
          const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockResolvedValue(error.publicMessage),
          } as Partial<Response>;

          const expectedResponse = { error: "General error" };

          generalError(error, req as Request, response as Response, next);

          expect(response.json).toBeCalledWith(expectedResponse);
        });
      });
    });
  });
});
