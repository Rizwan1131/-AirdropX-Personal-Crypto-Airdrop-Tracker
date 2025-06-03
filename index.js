import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import airdropRoutes from './routes/airdrop.Routes.js'

dotenv.config();
const app = express();
app.use(express.json());
import cookieParser from 'cookie-parser';
import connectWithDB from './config/db.js';
app.use(cookieParser());


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/airdrop', airdropRoutes);

const PORT = process.env.PORT || 4000

connectWithDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ DB connection failed:", error);
  });

