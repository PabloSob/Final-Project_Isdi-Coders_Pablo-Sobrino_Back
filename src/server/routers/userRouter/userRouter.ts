import express from "express";
import { validate } from "express-validation";
import { loginUser, registerUser } from "../../controllers/usersController";
import {
  userLoginCredentials,
  userRegisterCredentials,
} from "../../schemas/userCredentialsSchema";

const usersRouter = express.Router();

usersRouter.post("/register", validate(userRegisterCredentials), registerUser);
usersRouter.post("/login", validate(userLoginCredentials), loginUser);

export default usersRouter;
