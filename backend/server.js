import dotenv from "dotenv";
import express from "express";
import postRoute from "./routes/post.route.js";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
dotenv.config();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET_KEY
})
const app = express();
const PORT = process.env.PORT || 3000; // Use a default port if not defined in .env
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/users",userRoute);
app.use("/api/posts",postRoute);
app.listen(PORT, () => {
    console.log(`Server is deployed at ${PORT}`);
    connectDB();
});
 