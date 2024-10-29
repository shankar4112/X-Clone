import dotenv from "dotenv";
import express from "express";
import authRoute from "./routes/auth.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Use a default port if not defined in .env

app.use("/api/auth", authRoute);

app.listen(PORT, () => {
    console.log(`Server is deployed at ${PORT}`);
});
