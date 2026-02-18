import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import userApi from "./routes/userApi.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api", userApi);

const mongoUri: string | undefined = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const server = app.listen(PORT, () => {
  console.log("Server listening on port http://localhost:" + PORT);
});

export default app;
export { server }; // for testing
