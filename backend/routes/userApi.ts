import User from "../models/userModel.js";

import bcrypt from "bcrypt";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { Router, type Request, type Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { loginLimit, signupLimit } from "../middleware/ratelimit.js";

const router = Router();

router.post("/login", loginLimit, async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // find user by email
  const user = await User.findOne({ email: email.toLowerCase() });

  // check if user exists and password is correct
  if (!user) {
    return res.status(401).json({ emailError: "Email not found" });
  }
  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ passwordError: "Incorrect password" });
  }

  const token = jwt.sign({ id: email }, process.env.JWT_SECRET!, { expiresIn: "1d" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: "strict",
  });
  res.status(200).json({ email: user.email, name: user.name });
});

router.post("/signup", signupLimit, async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ nameError: "All fields are required" });
  }

  // check if name is between 2 and 15 characters
  if (name.length < 2 || name.length > 15) {
    return res.status(400).json({ nameError: "Name must be between 2 and 15 characters" });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  // check if email already exists
  if (existingUser) {
    return res.status(400).json({ emailError: "Email already exists" });
  }

  // check password length
  if (password.length < 8) {
    return res.status(400).json({ passwordError: "Password must be at least 8 characters" });
  } else if (password.length > 30) {
    return res.status(400).json({ passwordError: "Password must be less than 30 characters" });
  }

  // check if password contains at least one number and atleast one letter
  if (!/(?=.*[0-9])(?=.*[a-zA-Z])/.test(password)) {
    return res.status(400).json({ passwordError: "Password must contain at least one letter and one number" });
  }

  // create new user
  const user = await User.create({
    email: email.toLowerCase(),
    password: await bcrypt.hash(password, 10),
    name: name[0].toUpperCase() + name.slice(1).toLowerCase(),
  });
  if (!user) {
    return res.status(401).json({ emailError: "Registration failed" });
  }

  const token = jwt.sign({ id: email }, process.env.JWT_SECRET!, { expiresIn: "1d" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: "strict",
  });

  res.status(201).json({ message: "Registration successful" });
});

router.get("/auth-status", async (req: Request, res: Response) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).send("Unauthorized");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await User.findOne({ email: decoded.id.toLowerCase() }).select("-password");
    res.status(200).json({ user: user });
  } catch {
    res.status(401).send("Invalid token");
  }
});

router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/auth/google", async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });
    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({ message: "Google Auth failed" });
    }

    const { email, name } = payload;

    if (!email) return res.status(400).json({ message: "Google account has no email" });

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = await User.create({
        email: email.toLowerCase(),
        name: name || "Google User",
        password: await bcrypt.hash(jwt.sign({ id: email }, process.env.JWT_SECRET!), 10),
      });
    }

    const jwtToken = jwt.sign({ id: email }, process.env.JWT_SECRET!, { expiresIn: "1d" });

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    res.status(200).json({ email: user.email, name: user.name });
  } catch (error) {
    console.error("Google Auth failed:", error);
    res.status(401).json({ message: "Google Auth failed" });
  }
});

export default router;
