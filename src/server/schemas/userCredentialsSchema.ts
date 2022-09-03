import { Joi } from "express-validation";

export const userRegisterCredentials = {
  body: Joi.object({
    userName: Joi.string().min(5).required(),
    password: Joi.string().min(5).required(),
  }),
};

export const userLoginCredentials = {
  body: Joi.object({
    userName: Joi.string().min(5).required(),
    password: Joi.string().min(5).required(),
  }),
};
