import express from "express";
import morgan from "morgan";
import cors from "cors";
import { generalError, notFoundError } from "./middlewares/errors";
import usersRouter from "./routers/userRouter/userRouter";
import cryptoRouter from "./routers/cryptoRouter/cryptoRouter";

const app = express();
app.disable("x-powered-by");

app.use(cors());
app.use(morgan("dev"));
app.use(express.static("uploads"));
app.use(express.json());

app.use("/users", usersRouter);
app.use("/crypto", cryptoRouter);

app.use(notFoundError);
app.use(generalError);

export default app;
