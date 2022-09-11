import path from "path";
import { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import parseData from "./parseData";
import CustomError from "../../utils/CustomError";

jest.useFakeTimers();

describe("Given a parseData middleware", () => {
  describe("When called with a request, a response and a next function as arguments", () => {
    const mockedReqBody = {
      logo: "",
    };

    const cryptoJson = JSON.stringify(mockedReqBody);

    jest
      .spyOn(path, "join")
      .mockReturnValue(`${path.join("uploads", "logos")}`);

    jest.spyOn(fs, "rename").mockResolvedValue();

    const req = {
      body: { crypto: cryptoJson },
      file: { filename: "eflereom", originalname: "eflereom" },
    } as Partial<Request>;

    const res = {} as Partial<Response>;

    const next = jest.fn() as NextFunction;

    test("Then it should asign the data as req body", async () => {
      await parseData(req as Request, res as Response, next);

      expect(req.body).toEqual({
        ...mockedReqBody,
        logo: `${Date.now()}${req.file.filename}`,
      });

      expect(next).toHaveBeenCalled();
    });

    test("Then it should asign the data as req body", async () => {
      const reqWithoutImage = {
        body: { crypto: cryptoJson },
      } as Partial<Request>;

      const customError = new CustomError(404, "Missing data", "Missing data");
      await parseData(reqWithoutImage as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});
