import * as mongoose from 'mongoose';

export const MedicalStaffSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'name is required'] },
  gender: { type: String, required: [true, 'gender is required'] },
  mobile: { type: String, required: [true, 'mobile is required'] },
  address: { type: String, required: [true, 'address is required'] },
  map_coordination: {
    type: String,
    required: [true, 'map_coordination is required'],
  },
  specialization: {
    type: String,
    required: [true, 'specialization is required'],
  },
  medical_services: {
    type: Array,
    required: [true, 'medical_services is required'],
  },
  coveraged_areas: {
    type: Array,
    required: [true, 'coveraged_areas is required'],
  },
  deliveryed_consumables: {
    type: Array,
    required: [true, 'deliveryed_consumables is required'],
  },
  tasks: { type: Array, required: [true, 'tasks is required'] },
  account_status: {
    type: String,
    required: [true, 'account_status is required'],
  },
  email: { type: String, required: [true, 'email is required'] },
  password: { type: String, required: [true, 'password is required'] },
  role: { type: String, required: true },
  hashed_refresh_token: { type: String },
});

export interface MedicalStaff extends mongoose.Document {
  id: string;
  name: string;
  gender: string;
  address: string;
  map_coordination: string;
  account_status: string;
  mobile: string;
  email: string;
  password: string;
  specialization: string;
  medical_services: Array<any>;
  coveraged_areas: Array<any>;
  deliveryed_consumables: Array<any>;
  tasks: Array<any>;
  role: string;
  hashed_refresh_token: string;
}
