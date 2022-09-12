import express from "express";
import multer from "multer";
import {
  getAllCrypto,
  deleteCrypto,
  getById,
  createCrypto,
  modifyCrypto,
} from "../../controllers/crypto/cryptoController";
import { authentication } from "../../middlewares/authentication";
import parseData from "../../middlewares/parseData";
import supaBaseUpload from "../../middlewares/supaBase";

const cryptoRouter = express.Router();
const upload = multer({ dest: "uploads", limits: { fileSize: 3000000 } });

cryptoRouter.get("/", authentication, getAllCrypto);
cryptoRouter.delete("/:id", authentication, deleteCrypto);
cryptoRouter.get("/:id", getById);
cryptoRouter.post(
  "/",
  upload.single("logo"),
  parseData,
  supaBaseUpload,
  createCrypto
);
cryptoRouter.put(
  "/:id",
  upload.single("logo"),
  parseData,
  supaBaseUpload,
  modifyCrypto
);

export default cryptoRouter;
