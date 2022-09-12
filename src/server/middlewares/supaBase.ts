import { createClient } from "@supabase/supabase-js";
import { NextFunction, Request, Response } from "express";
import { readFile } from "fs/promises";
import path from "path";
import CustomError from "../../utils/CustomError";
import "../../loadEnvironments";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPA_KEY);

const supaBaseUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { logo } = req.body;
  const logoPath = path.join("uploads", logo);

  try {
    const fileData = await readFile(logoPath);

    const storage = supabase.storage.from("cryptorealm");

    const uploadResult = await storage.upload(logo, fileData);
    if (uploadResult.error) {
      next(uploadResult.error);
      return;
    }
    const { publicURL } = storage.getPublicUrl(logo);
    req.body.imageBackUp = publicURL;
    next();
  } catch (error) {
    const newError = new CustomError(
      500,
      "Couldn't upload or read the image",
      "Error while reading and uploading the image"
    );
    next(newError);
  }
};

export default supaBaseUpload;
