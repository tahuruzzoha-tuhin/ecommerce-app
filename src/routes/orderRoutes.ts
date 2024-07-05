import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
} from '../controllers/orderController';

const router = Router();

// ############ ORDERS ROUTES ###############
router.post('/', createOrder);
router.get('/', getAllOrders);


export default router;
