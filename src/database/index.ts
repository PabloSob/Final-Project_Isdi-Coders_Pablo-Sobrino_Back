import "../loadEnvironments";
import Debug from "debug";
import mongoose from "mongoose";
import chalk from "chalk";

const debug = Debug("cryptorealm:database");

const connectDB = (mongoUrl: string) =>
  new Promise((resolve, reject) => {
    mongoose.set("toJSON", {
      virtuals: true,
      transform: (doc, ret) => {
        const newDocument = { ...ret };

        // eslint-disable-next-line no-underscore-dangle
        delete newDocument.__v;
        // eslint-disable-next-line no-underscore-dangle
        delete newDocument._id;
        delete newDocument.password;
        return newDocument;
      },
    });

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

export default connectDB;
