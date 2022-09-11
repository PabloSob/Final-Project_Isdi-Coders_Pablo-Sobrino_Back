import express from "express";
import {
  getAllCrypto,
  deleteCrypto,
  getById,
  createCrypto,
  modifyCrypto,
} from "../../controllers/crypto/cryptoController";
import { authentication } from "../../middlewares/authentication";

const cryptoRouter = express.Router();

cryptoRouter.get("/", authentication, getAllCrypto);
cryptoRouter.delete("/:id", authentication, deleteCrypto);
cryptoRouter.get("/:id", getById);
cryptoRouter.post("/", createCrypto);
cryptoRouter.put("/:id", modifyCrypto);

export default cryptoRouter;
