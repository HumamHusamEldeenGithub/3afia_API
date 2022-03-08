import { Patient } from '../patients/patient.model';
import * as mongoose from 'mongoose';

export const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String, required: true },
  map_coordination: { type: String, required: true },
  account_status: { type: String, required: true },
  email: { type: String, required: true },
  patients: [{ type: Object }],
  password: { type: String, required: true },
});

export interface Client extends mongoose.Document {
  id: string;
  name: string;
  gender: string;
  address: string;
  map_coordination: string;
  account_status: string;
  mobile: string;
  email: string;
  patients: Patient[];
  password: string;
}
