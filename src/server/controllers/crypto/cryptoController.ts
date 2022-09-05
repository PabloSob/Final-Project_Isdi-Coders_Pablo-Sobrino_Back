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
    if (crypto.length === 0) {
      res.status(404).json({ crypto: "No crypto found" });
      return;
    }
    res.status(200).json({ crypto });
  } catch (error) {
    const newError = new CustomError(
      404,
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
