import express from "express";
import getAllCrypto from "../../controllers/crypto/cryptoController";

const cryptoRouter = express.Router();

cryptoRouter.get("/", getAllCrypto);

export default cryptoRouter;
