import "../../loadEnvironments";
import Debug from "debug";
import chalk from "chalk";
import { NextFunction, Request, Response } from "express";
import ICustomError from "../../interfaces/errorInterfaces";

const debug = Debug("cryptorealm:server:middlewares:errors");

export const notFoundError = (req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint not found" });
};

export const generalError = (
  error: ICustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const errorCode = error.code ?? 500;
  const errorMessage = error.publicMessage ?? "General error";

  debug(chalk.red(error.message));

  res.status(errorCode).json({ error: errorMessage });
};
