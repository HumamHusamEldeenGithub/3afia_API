import * as mongoose from 'mongoose';

export const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String, required: true },
  map_coordination: { type: String, required: true },
  account_status: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export interface Patient extends mongoose.Document {
  id: string;
  name: string;
  gender: string;
  address: string;
  map_coordination: string;
  account_status: string;
  mobile: string;
  email: string;
  password: string;
}
