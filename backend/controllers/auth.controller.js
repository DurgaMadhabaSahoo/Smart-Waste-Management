import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// ✅ Signup Controller (with role)
export const signup = async (req, res, next) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return next(errorHandler(400, "User already exists"));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user", // default to 'user' if not provided
    });

    await newUser.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    next(error);
  }
};

// ✅ Signin Controller
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    const isPasswordCorrect = bcryptjs.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return next(errorHandler(401, "Invalid password"));
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password: _, ...userWithoutPassword } = user._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 86400000,
      })
      .status(200)
      .json({
        message: "Login successful",
        token,
        user: userWithoutPassword,
      });
  } catch (error) {
    next(error);
  }
};

// ✅ Signout Controller
export const signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token", {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({ message: "User signed out successfully" });
  } catch (error) {
    next(error);
  }
};
