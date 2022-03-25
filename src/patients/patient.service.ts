import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient } from './patient.model';
import * as mongooseErrorHandler from 'mongoose-validation-error-message-handler';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel('Patient') private readonly patientDB: Model<Patient>,
  ) {}

  async insertPatient(
    national_id: string,
    name: string,
    gender: string,
    birthdate: number,
    address: string,
    map_coordination: string,
    mobile: string,
    email: string,
  ) {
    try {
      const role = 'patient';
      const newPatient = new this.patientDB({
        national_id,
        name,
        role,
        gender,
        birthdate,
        address,
        map_coordination,
        mobile,
        email,
      });
      await newPatient.save();
      return {
        national_id: newPatient.national_id,
        name: newPatient.name,
        gender: newPatient.gender,
        birthdate: newPatient.birthdate,
        address: newPatient.address,
        map_coordination: newPatient.map_coordination,
        mobile: newPatient.mobile,
        email: newPatient.email,
      };
    } catch (e) {
      const mongooseErorr = mongooseErrorHandler(e);
      throw new ForbiddenException(mongooseErorr.toString());
    }
  }
  async getPatients() {
    const allPatients = await this.patientDB.find().exec();
    return allPatients.map((patient) => ({
      national_id: patient.national_id,
      name: patient.name,
      role: patient.role,
      gender: patient.gender,
      birthdate: patient.birthdate,
      address: patient.address,
      map_coordination: patient.map_coordination,
      mobile: patient.mobile,
      email: patient.email,
    }));
  }
  async getSinglePatient(national_id: string) {
    const patient = await this.findPatientByNationalID(national_id);
    return {
      national_id: patient.national_id,
      name: patient.name,
      role: patient.role,
      gender: patient.gender,
      birthdate: patient.birthdate,
      address: patient.address,
      map_coordination: patient.map_coordination,
      mobile: patient.mobile,
      email: patient.email,
    };
  }

  async updatePatient(
    national_id: string,
    name: string,
    gender: string,
    birthdate: number,
    address: string,
    map_coordination: string,
    mobile: string,
    email: string,
  ) {
    const updatedPatient = await this.findPatientByNationalID(national_id);
    if (name) updatedPatient.name = name;
    if (mobile) updatedPatient.mobile = mobile;
    if (email) updatedPatient.email = email;
    if (gender) updatedPatient.gender = gender;
    if (birthdate) updatedPatient.birthdate = birthdate;
    if (address) updatedPatient.address = address;
    if (map_coordination) updatedPatient.email = map_coordination;
    await updatedPatient.save();
    return {
      national_id: updatedPatient.national_id,
      name: updatedPatient.name,
      gender: updatedPatient.gender,
      birthdate: updatedPatient.birthdate,
      address: updatedPatient.address,
      map_coordination: updatedPatient.map_coordination,
      mobile: updatedPatient.mobile,
      email: updatedPatient.email,
    };
  }

  async deletePatient(userNational_id: string) {
    await this.patientDB.deleteOne({ national_id: userNational_id }).exec();
    return { message: 'Patient has been deleted successfully' };
  }

  async findPatient(id: string): Promise<Patient> {
    let reqPatient;
    try {
      reqPatient = await this.patientDB.findById(id);
    } catch (e) {
      throw new NotFoundException('Could not find patient');
    }
    if (!reqPatient) {
      throw new NotFoundException('Could not find patient');
    }
    return reqPatient;
  }

  async findPatientByNationalID(userNationalID: string): Promise<Patient> {
    let reqPatient;
    try {
      reqPatient = await this.patientDB.findOne({
        national_id: userNationalID,
      });
    } catch (e) {
      throw new NotFoundException('Could not find patient');
    }
    if (!reqPatient) {
      throw new NotFoundException('Could not find patient');
    }
    return reqPatient;
  }

  async findPatientByEmail(userEmail: string): Promise<Patient> {
    let reqPatient;
    try {
      reqPatient = await this.patientDB.findOne({ email: userEmail });
    } catch (e) {
      throw new NotFoundException('Could not find patient');
    }
    if (!reqPatient) {
      throw new NotFoundException('Could not find patient');
    }
    return reqPatient;
  }
}
