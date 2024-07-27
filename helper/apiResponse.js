import jwt from "jsonwebtoken";
import Auth from "../models/Auth.js";

export const validateResponse = (res, error) => {
  let arrObj = { message: "error", success: false };
  error.details?.map((item) => {
    const { path, message } = item;
    arrObj = { ...arrObj, [path]: message?.replace(/['"]/g, "") };
  });

  return res.status(400).json(arrObj);
};

export const varifyAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const verifyToken = await jwt.verify(token, process.env.TOKEN_SECRETE);
    const user = await Auth.findById(verifyToken.userId);
    if (!token || !verifyToken || !user) {
      return res.status(404).json({ message: "unAuthorized", success: false });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
