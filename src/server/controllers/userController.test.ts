import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../../database/models/User";
import registerUser from "./usersController";
import CustomError from "../../utils/CustomError";

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
  });
});
