import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors'

import 'dotenv/config'

import authRoutes from './src/routers/authRoutes';
import fileRoutes from './src/routers/fileRoutes';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cors());
const api = process.env.API_URL 
app.use('/uploads', express.static('uploads'));

app.use(`${api}/auth`, authRoutes);
app.use(`${api}/files`, fileRoutes);
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    console.log("database connected"),
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    )
  )
  .catch((err) => console.error(err));
