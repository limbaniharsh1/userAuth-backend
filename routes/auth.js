import express from "express";
const router = express.Router();
import * as authRoute from "../controllers/auth.js";
import * as authValidation from "../validation/auth.js";
import { varifyAuth } from "../helper/apiResponse.js";

router.post("/register", authValidation.register, authRoute.register);
router.post("/login", authValidation.login, authRoute.login);
router.post(
  "/change-password",
  varifyAuth,
  authValidation.changePassword,
  authRoute.changePassword
);
router.post("/logout", authValidation.token, authRoute.logOut);

export default router;
