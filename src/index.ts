import express, {NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.MONGO_URI;

async function main() {
  try {
  
    await mongoose.connect(DB_URI as string);

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT} with MongoDB`);
    });
    app.get('/',(req:Request, res:Response)=>{
      res.send({"message":"Server running with mongodb atlas"})
    })

  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
}

main();
