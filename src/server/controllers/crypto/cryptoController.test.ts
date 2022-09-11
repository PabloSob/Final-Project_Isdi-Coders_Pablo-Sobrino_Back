import { NextFunction, Request, Response } from "express";
import Crypto from "../../../database/models/Crypto";
import { ICrypto } from "../../../interfaces/cryptoInterface";
import CustomError from "../../../utils/CustomError";
import {
  getAllCrypto,
  deleteCrypto,
  getById,
  createCrypto,
  modifyCrypto,
} from "./cryptoController";

jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  decode: jest.fn().mockReturnValue({
    id: "34534dsfg",
  }),
}));

jest.mock("../../../database/models/Crypto", () => ({
  find: jest.fn().mockReturnValue([
    {
      title: "cococoin",
      logo: "crypto.png",
      description: "a great crypto",
      team: 2,
      value: 4,
      ICO: new Date(),
    },
  ]),
}));

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
        200,
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

describe("Given a getById function", () => {
  describe("When it's called with a request, response and next function", () => {
    test("Then it show response with a status 200 and the crypto found", async () => {
      const mockCrypto: ICrypto = {
        title: "cococoin",
        logo: "crypto.png",
        description: "a great crypto",
        team: 2,
        value: 4,
        ICO: new Date(),
      };
      const requestTest = {
        params: { id: "4654dfsg546" },
      } as Partial<Request>;

      const expectedStatus = 200;
      const expectedResult = { crypto: mockCrypto };
      const next = jest.fn() as NextFunction;

      const responseTest = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as Partial<Response>;

      Crypto.findById = jest.fn().mockResolvedValue(expectedResult);

      await getById(requestTest as Request, responseTest as Response, next);
      expect(responseTest.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a request to find a crypto, but can't find it", () => {
    test("Then it should response with 404 as code", async () => {
      const requestTest = {
        params: { id: "" },
      } as Partial<Request>;

      const expectedStatus = 404;

      Crypto.findById = jest.fn().mockReturnValue("");

      const next = jest.fn() as NextFunction;

      const responseTest = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      await getById(requestTest as Request, responseTest as Response, next);

      expect(responseTest.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a request to find a crypto, but has error while finding the crypto requested", () => {
    test("Then it should call next function with an error", async () => {
      Crypto.findById = jest.fn().mockRejectedValue(new Error());

      const requestTest = {
        params: { id: "" },
      } as Partial<Request>;

      const responseTest = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      const expectedError = new CustomError(
        404,
        "No crypto found",
        "Error while finding the crypto requested"
      );

      const next = jest.fn() as NextFunction;

      await getById(requestTest as Request, responseTest as Response, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a createCrypto controller", () => {
  describe("When its invoked with method createCrypto", () => {
    test("then it should call the status method with a 200 and json with the crypto created", async () => {
      const mockCrypto: ICrypto = {
        title: "cococoin",
        logo: "",
        description: "",
        team: 2,
        value: 4,
        ICO: new Date(),
      };
      const req = {} as Partial<Request>;
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue({ cryptoCreated: mockCrypto }),
      };

      const next = jest.fn();
      Crypto.create = jest.fn().mockResolvedValue(mockCrypto);

      await createCrypto(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ cryptoCreated: mockCrypto });
    });
    test("And if it throw an error creating it should next with an error", async () => {
      const error = new CustomError(
        400,
        "Error creating a crypto",
        "Cannot create the crypto"
      );
      const req = {} as Partial<Request>;
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue([]),
      };
      const next = jest.fn();
      Crypto.create = jest.fn().mockRejectedValue(error);

      await createCrypto(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a modifyCrypto function", () => {
  describe("When it's called with a request, response and next function", () => {
    test("Then it show response with a status 200 and the modified crypto", async () => {
      const upDatedCrypto = {
        title: "cococoin",
        logo: "",
        description: "",
        team: 2,
        value: 4,
        ICO: new Date(),
      };

      const requestTest = {
        body: upDatedCrypto,
        params: { id: "62e0ajh9b455361" },
      } as Partial<Request>;

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue({ upDatedCrypto }),
      };

      Crypto.findByIdAndUpdate = jest.fn().mockResolvedValue(upDatedCrypto);

      const expectedStatus = 200;

      const next = jest.fn() as NextFunction;

      await modifyCrypto(requestTest as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ upDatedCrypto });
    });

    test("Then it should next with an error if it cannot complete the update", async () => {
      const errorTest = new CustomError(
        400,
        "Error to modify crypto",
        "Could not modify the crypto"
      );

      Crypto.findByIdAndUpdate = jest.fn().mockRejectedValue(errorTest);

      const req = {
        params: { id: "" },
      } as Partial<Request>;

      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue([]),
      };
      const next = jest.fn();

      await modifyCrypto(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(errorTest);
    });
  });
});
