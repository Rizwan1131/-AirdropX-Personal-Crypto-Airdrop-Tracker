import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import airdropRoutes from './routes/airdrop.Routes.js'

dotenv.config();
const app = express();
app.use(express.json());
import cookieParser from 'cookie-parser';
app.use(cookieParser());


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/airdrop', airdropRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB connected");
    app.listen(process.env.PORT, () => {
      console.log("Server running on port", process.env.PORT);
    });
  })
  .catch((err) => console.log(err));
