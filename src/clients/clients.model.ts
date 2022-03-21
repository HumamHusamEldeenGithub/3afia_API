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
  secret_key: { type: String },
  role: { type: String, required: true },
  hashed_refresh_token: { type: String },
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
  patients: Array<any>;
  password: string;
  secret_key: string;
  role: string;
  hashed_refresh_token: string;
}
