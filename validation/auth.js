import Joi from "joi";
import { validateResponse } from "../helper/apiResponse.js";

export const register = (req, res, next) => {
  const validateSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  const { error } = validateSchema.validate(req.body);
  if (error) return validateResponse(res, error);
  next();
};

export const login = (req, res, next) => {
  const validationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  const { error } = validationSchema.validate(req.body);
  if (error) return validateResponse(res, error);
  next();
};

export const changePassword = (req, res, next) => {
  const validationSchema = Joi.object({
    email: Joi.string().email().required(),
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
  });
  const { error } = validationSchema.validate(req.body);
  if (error) return validateResponse(res, error);
  next();
};
