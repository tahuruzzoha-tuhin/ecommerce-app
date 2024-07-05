import mongoose, { Document, Schema } from 'mongoose';


// #####################  ORDER INTERFACE ########################
export interface IOrder extends Document {
  order_id: number;
  email: string;
  productId: mongoose.Types.ObjectId;
  price: number;
  quantity: number;
}


// #####################  ORDER MODEL ########################
const OrderSchema = new Schema<IOrder>({
  email: { type: String, required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

export default mongoose.model<IOrder>('Order', OrderSchema);
