
import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import { validateCreateOrder, isValidEmail} from '../utils/validateOrder';


// #####################  CREATE ORDER CONTROLLER ########################
export const createOrder = async (req: Request, res: Response) => {
  try {
    const orderData = validateCreateOrder(req.body);
    const { email, productId, price, quantity } = orderData;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    if (product.inventory.quantity < quantity) {
      return res.status(400).json({ success: false, error: 'Insufficient quantity available in inventory' });
    }

    const newQuantity = product.inventory.quantity - quantity;
    const newInStock = newQuantity > 0;

    await Product.findByIdAndUpdate(productId, {
      'inventory.quantity': newQuantity,
      'inventory.inStock': newInStock,
    });

    const order = new Order({
      email,
      productId,
      price,
      quantity,
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully!',
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create order' });
  }
};



// #####################  GET ORDER CONTROLLER ########################
export const getAllOrders = async (req: Request, res: Response) => {
  const email = req.query.email as string | undefined;

  if (email && !isValidEmail(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email format' });
  }

  try {
    let orders;

    if (email) {
      orders = await Order.find({ email });
      if (orders.length === 0) {
        return res.status(404).json({
          success: false,
          message: `No orders found for user email '${email}'`,
        });
      }
      res.status(200).json({
        success: true,
        message: `Orders fetched successfully for user email '${email}'!`,
        data: orders,
      });
    } else {
      orders = await Order.find();
      if (orders.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No orders found',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Orders fetched successfully!',
        data: orders,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
};
