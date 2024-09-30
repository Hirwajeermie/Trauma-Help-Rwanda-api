import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import cloudinary from "cloudinary";
import "dotenv/config";
import authRoutes from "./src/routers/authRoutes.js";
import fileRoutes from "./src/routers/fileRoutes.js";
import cookieParser from "cookie-parser";

const app = express();


app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use(cors());
app.use(morgan("dev"));

const api = process.env.API_URL;

app.use(`${api}/auth`, authRoutes);
app.use(`${api}/files`, fileRoutes);
app.use(cookieParser());

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use((req, res, next) => {
  res.setTimeout(300000, () => {
    console.error('Request has timed out.');
    res.status(408).send('Request timed out.');
  });
  next();
});

app.use("/", (req, res) => {
  res.send("server is running");
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => console.log("database connected"),
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    )
  )
  .catch((err) => console.error(err));

  