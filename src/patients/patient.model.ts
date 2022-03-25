import * as mongoose from 'mongoose';

export const PatientSchema = new mongoose.Schema({
  national_id: { type: String, unique: true, required: true, dropDups: true },
  name: { type: String, required: true },
  gender: { type: String, required: true },
  mobile: { type: String, required: true },
  birthdate: { type: Number, required: true },
  address: { type: String, required: true },
  map_coordination: { type: String, required: true },
  email: { type: String, unique: true },
  role: { type: String, required: true },
});

export interface Patient extends mongoose.Document {
  id: string;
  national_id: string;
  name: string;
  gender: string;
  birthdate: number;
  address: string;
  map_coordination: string;
  account_status: string;
  mobile: string;
  email: string;
  role: string;
}
