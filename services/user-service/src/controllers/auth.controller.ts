import { Request, Response } from "express";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";
import logger from "../utils/logger.js";

// ================= REGISTER =================
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({ name, email, password: hashed });

    logger.info("New user registered", { email });

    return res.status(201).json({ message: "Registered successfully" });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    logger.error("Register error", { err });
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= LOGIN =================
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    logger.info("User logged in", { email });

    return res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    logger.error("Login error", { err });
    return res.status(500).json({ message: "Server error" });
  }
};
