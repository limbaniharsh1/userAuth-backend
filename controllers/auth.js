import Auth from "../models/Auth.js";
import bcrypt from "bcrypt";
import * as authValidation from "../validation/auth.js";
import jwt from "jsonwebtoken";
import { redisHandler } from "../helper/redisHandler.js";
const redis = redisHandler();

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // user already registered
    const findUser = await Auth.findOne({ email });
    if (findUser) {
      return res.status(409).json({ message: "user already registerd" });
    }

    // create user
    const bcryptPass = await bcrypt.hash(password, 10);

    const user =
      email !== process.env.ADMIN_EMAIL
        ? await Auth.create({ username, email, password: bcryptPass })
        : await Auth.create({
            username,
            email,
            password: bcryptPass,
            role: "admin",
          });
    delete user?._doc.password;
    return res
      .status(200)
      .json({ message: "user created successfully", data: user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const findUser = await Auth.findOne({ email });
    const comparePassword = await bcrypt.compare(password, findUser.password);

    if (!findUser || !comparePassword) {
      return res
        .status(401)
        .json({ messsage: "invalid credential", success: false });
    }

    const token = await jwt.sign(
      { userId: findUser._id },
      process.env.TOKEN_SECRETE,
      { expiresIn: process.env.TOKEN_EXPIRE }
    );
    res
      .status(200)
      .json({ message: "user login successfully", success: true, token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    const findUser = await Auth.findOne({ email });
    const comparePass = await bcrypt.compare(oldPassword, findUser.password);
    if (!findUser || !comparePass) {
      return res
        .status(401)
        .json({ message: "invalid credential", success: false });
    }
    if (oldPassword == newPassword) {
      return res.status(403).json({
        message: "password must be different from old password",
        success: false,
      });
    }
    const userUpdate = await Auth.findByIdAndUpdate(findUser._id, {
      password: await bcrypt.hash(newPassword, 10),
    });

    res
      .status(200)
      .json({ message: "password has been changed", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logOut = async (req, res) => {
  try {
    const { token } = await req.body;
    const { userId } = await jwt.verify(token, process.env.TOKEN_SECRETE);
    let userTokenData = [];

    if (!userId) {
      return res.status(401).json({ message: "invalid token", success: false });
    }

    try {
      await redis.setValue(userId, token);
    } catch (error) {
      console.log(error);
    }

    res.status(200).json({ message: "successfully logout!", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
