import "../loadEnvironments";
import Debug from "debug";
import mongoose from "mongoose";
import chalk from "chalk";

const debug = Debug("cryptorealm:database");

const connectDatabase = (mongoUrl: string) =>
  new Promise((resolve, reject) => {
    mongoose.connect(mongoUrl, (error) => {
      if (error) {
        debug(chalk.redBright("Can not connect the database"));
        reject(error);
        return;
      }
      debug(chalk.greenBright("Connected to database"));
      resolve(true);
    });
  });

export default connectDatabase;
