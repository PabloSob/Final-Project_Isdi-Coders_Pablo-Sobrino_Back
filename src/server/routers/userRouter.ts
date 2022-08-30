import express from "express";
import { validate } from "express-validation";
import registerUser from "../controllers/usersController";
import userCredentialsSchema from "../schemas/userCredentialsSchema";

const usersRouter = express.Router();

usersRouter.post("/register", validate(userCredentialsSchema), registerUser);

export default usersRouter;
