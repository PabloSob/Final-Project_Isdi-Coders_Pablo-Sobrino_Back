import { Joi } from "express-validation";

const userCredentialsSchema = {
  body: Joi.object({
    userName: Joi.string().min(5).required(),
    password: Joi.string().min(5).required(),
    repeat_password: Joi.ref("password"),
  }),
};

export default userCredentialsSchema;
