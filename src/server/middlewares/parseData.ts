import { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import CustomError from "../../utils/CustomError";

const parseData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newCrypto = req.body.crypto;

    const cryptoObject = await JSON.parse(newCrypto);

    const newName = `${Date.now()}${req.file.originalname}`;
    cryptoObject.logo = newName;

    await fs.rename(
      path.join("uploads", req.file.filename),
      path.join("uploads", newName)
    );

    cryptoObject.logo = newName;

    req.body = cryptoObject;

    next();
  } catch (error) {
    const newError = new CustomError(404, "Missing data", "Missing data");
    next(newError);
  }
};

export default parseData;
