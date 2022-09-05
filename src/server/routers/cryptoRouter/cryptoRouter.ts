import express from "express";
import {
  getAllCrypto,
  deleteCrypto,
} from "../../controllers/crypto/cryptoController";
import { authentication } from "../../middlewares/authentication";

const cryptoRouter = express.Router();

cryptoRouter.get("/", getAllCrypto);
cryptoRouter.delete("/:id", authentication, deleteCrypto);

export default cryptoRouter;
