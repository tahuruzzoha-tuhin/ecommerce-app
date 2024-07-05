import mongoose, { Document, Schema } from 'mongoose';


// #####################  COUNTER INTERFACE ########################
export interface ICounter extends Document {
  entity: string;
  lastId: number;
}


// #####################  COUNTER MODEL ########################
const CounterSchema = new Schema<ICounter>({
  entity: { type: String, required: true, unique: true },
  lastId: { type: Number, required: true },
});

export default mongoose.model<ICounter>('Counter', CounterSchema);
