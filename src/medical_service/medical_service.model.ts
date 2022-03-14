import * as mongoose from 'mongoose';

export const MedicalServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: Array, required: true },
  perquisites: { type: Array, required: true },
  tools: { type: Array, required: true },
  consumables: { type: Array, required: true },
  price: { type: String, required: true },
});

export interface MedicalService extends mongoose.Document {
  id: string;
  name: string;
  category: string;
  perquisites: Array<any>;
  tools: Array<any>;
  consumables: Array<any>;
  price: string;
}
