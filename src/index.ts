import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.MONGO_URI;

async function main() {
  try {
  
    await mongoose.connect(DB_URI as string);

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT} with MongoDB`);
    });

    app.use(express.json());


    // ############ BOOTSTRAP ROUTE ###############
    app.get('/',(req:Request, res:Response)=>{
      res.send({"message":"Server running with mongodb atlas"})
    })


    // ############ APLICATION ROUTES ###############
    app.use('/api/products', productRoutes);
    app.use('/api/orders', orderRoutes);


    // Not Found Route Middleware
    app.use((req : Request, res : Response) => {
      res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    });

    // Error Handling Middleware
    app.use((err : any, req : Request, res : Response) => {
      console.error(err);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error'
      });
    });

  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
}

main();

