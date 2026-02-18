import { rateLimit } from "express-rate-limit";

export const loginLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 login attempts per windowMs
  message: {
    emailError: "Too many login attempts, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

export const signupLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 successful signups per hour
  message: {
    emailError: "Too many signups from this IP, please try again after 1 hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true, // Don't count failed signup attempts, only successful ones
});
