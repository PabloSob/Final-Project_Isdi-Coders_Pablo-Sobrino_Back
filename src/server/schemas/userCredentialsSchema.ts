import { Joi } from "express-validation";

export const userRegisterCredentials = {
  body: Joi.object({
    userName: Joi.string().min(5).required(),
    password: Joi.string().min(5).required(),
    repeat_password: Joi.ref("password"),
  }),
};

export const userLoginCredentials = {
  body: Joi.object({
    userName: Joi.string().min(5).required(),
    password: Joi.string().min(5).required(),
  }),
};
