import express from "express";
import {
  getAllCrypto,
  deleteCrypto,
  getById,
} from "../../controllers/crypto/cryptoController";
import { authentication } from "../../middlewares/authentication";

const cryptoRouter = express.Router();

cryptoRouter.get("/", getAllCrypto);
cryptoRouter.delete("/:id", authentication, deleteCrypto);
cryptoRouter.get("/:id", authentication, getById);

export default cryptoRouter;
