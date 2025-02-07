import dotenv from "dotenv";
import express from "express";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Use a default port if not defined in .env
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/users",userRoute);
app.listen(PORT, () => {
    console.log(`Server is deployed at ${PORT}`);
    connectDB();
});
 