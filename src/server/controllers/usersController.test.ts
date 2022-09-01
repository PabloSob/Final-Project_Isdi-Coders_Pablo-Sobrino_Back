import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../../database/models/User";
import { loginUser, registerUser } from "./usersController";
import CustomError from "../../utils/CustomError";

const mockHashCreatorValue: boolean | jest.Mock = true;

let mockHashCompareValue = true;

jest.mock("../../utils/auth", () => ({
  ...jest.requireActual("../../utils/auth"),
  createToken: () => mockHashCreatorValue,
  hashCompare: () => mockHashCompareValue,
  verifyToken: () => true,
}));

describe("Given a registerUser controller", () => {
  const userTest = {
    userName: "admin",
    password: "admin",
  };

  const requestTest = {
    body: {
      user: userTest,
    },
  } as Partial<Request>;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;

  const bcryptHashTest = jest.fn().mockResolvedValue("test");
  (bcrypt.hash as jest.Mock) = bcryptHashTest;

  const nextTest = jest.fn();

  describe("When it receives a response object", () => {
    test("Then it should invoke the response method status with 201", async () => {
      const status = 201;

      User.create = jest.fn();

      await registerUser(
        requestTest as Request,
        res as Response,
        nextTest as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(status);
    });

    test("Then it should invoke the response method json with a new User", async () => {
      const expectedMessage = "User created";
      User.create = jest.fn().mockResolvedValue(userTest);

      await registerUser(requestTest as Request, res as Response, nextTest);

      expect(res.json).toHaveBeenCalledWith({ message: expectedMessage });
    });

    describe("When it doesn't receives an user with required properties", () => {
      test("Then it should next an error", async () => {
        const errorTest = new CustomError(400, "Error", "Error Public");
        User.create = jest.fn().mockRejectedValue(errorTest);

        await registerUser(
          requestTest as Request,
          res as Response,
          nextTest as NextFunction
        );

        expect(nextTest).toBeCalledWith(errorTest);
      });
    });

    describe("Given a loginUser function", () => {
      afterEach(() => {
        jest.clearAllMocks();
      });

      const fakeUser = {
        id: "00001",
        userName: "manolo",
        password: "manolito",
      };

      const req: Partial<Request> = { body: fakeUser };
      const next: Partial<NextFunction> = jest.fn();

      User.find = jest.fn().mockReturnValue([fakeUser]);

      describe("When invoked with a request, response and next", () => {
        test("Then it should call status function with code 200", async () => {
          mockHashCompareValue = true;
          await loginUser(
            req as Request,
            res as Response,
            next as NextFunction
          );
          const status = 200;

          expect(res.status).toHaveBeenCalledWith(status);
        });

        test("Then it should call the json method of the response", async () => {
          await loginUser(
            req as Request,
            res as Response,
            next as NextFunction
          );

          expect(res.json).toHaveBeenCalled();
        });

        test("Then it should call the next function with the created error", async () => {
          User.find = jest.fn().mockReturnValue([]);
          const error = new CustomError(
            403,
            "User not found",
            "User or password not valid"
          );

          await loginUser(
            req as Request,
            res as Response,
            next as NextFunction
          );

          expect(next).toHaveBeenCalledWith(error);
        });
        test("It should call the next function and throw an error if an user not found and throw a error", async () => {
          const error = new CustomError(
            403,
            "User not valid",
            "User or password not valid"
          );
          User.find = jest.fn().mockRejectedValue(new Error());

          await loginUser(
            req as Request,
            res as Response,
            next as NextFunction
          );

          expect(next).toHaveBeenCalledWith(error);
        });

        test("Then it should call next with an error, if the password is wrong", async () => {
          User.find = jest.fn().mockReturnValue(false);
          mockHashCompareValue = false;
          const error = new CustomError(
            403,
            "Password not valid",
            "User or password invalid"
          );

          await loginUser(
            req as Request,
            res as Response,
            next as NextFunction
          );

          expect(next).toHaveBeenCalledWith(error);
        });

        test("Then it should call the next function with the created error if the passwords don't match", async () => {
          const notValidPasswordTest = {
            userName: "testLogin",
            password: "498651",
          };

          User.find = jest.fn().mockReturnValue([notValidPasswordTest]);
          mockHashCompareValue = false;

          const userError = new CustomError(
            403,
            "Password not valid",
            "User or password invalid"
          );

          await loginUser(
            req as Request,
            res as Response,
            next as NextFunction
          );

          expect(next).toHaveBeenCalledWith(userError);
        });
      });
    });
  });
});
