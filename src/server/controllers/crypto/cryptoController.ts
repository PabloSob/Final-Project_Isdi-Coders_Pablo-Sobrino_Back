import { NextFunction, Request, Response } from "express";
import Crypto from "../../../database/models/Crypto";
import CustomError from "../../../utils/CustomError";

export const getAllCrypto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const crypto = await Crypto.find();
    res.status(200).json({ crypto });
  } catch (error) {
    const newError = new CustomError(
      200,
      "Error while getting crypto",
      "No crypto found"
    );

    next(newError);
  }
};

export const deleteCrypto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const deleteCryptoItem = await Crypto.findByIdAndDelete(id);
    if (deleteCryptoItem) {
      res.status(200).json({ message: "Crypto deleted correctly" });
    }
  } catch (error) {
    const newError = new CustomError(
      404,
      "Error while deleting crypto",
      "Error while deleting crypto"
    );
    next(newError);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const dbCrypto = await Crypto.findById(id);
    if (!dbCrypto) {
      res.status(404).json({ crypto: "No crypto found" });
      return;
    }

    res.status(200).json({ crypto: dbCrypto });
  } catch (error) {
    const newError = new CustomError(
      404,
      "No crypto found",
      "Error while finding the crypto requested"
    );

    next(newError);
  }
};

export const createCrypto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const crypto = req.body;

  try {
    const cryptoCreated = await Crypto.create(crypto);

    res.status(201).json({ cryptoCreated });
  } catch (error) {
    const newError = new CustomError(
      400,
      "Error creating a crypto",
      "Cannot create the crypto"
    );

    next(newError);
  }
};

export const modifyCrypto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const crypto = req.body;
  const { id } = req.params;

  try {
    const modifiedCrypto = {
      ...crypto,
      title: crypto.title,
      logo: crypto.logo,
      description: crypto.description,
      team: crypto.team,
      value: crypto.value,
      ICO: crypto.ICO,
    };

    const upDatedCrypto = await Crypto.findByIdAndUpdate(id, modifiedCrypto);
    res.status(200).json({ upDatedCrypto });
  } catch (error) {
    const newError = new CustomError(
      400,
      "Error to modify crypto",
      "Could not modify the crypto"
    );

    next(newError);
  }
};
