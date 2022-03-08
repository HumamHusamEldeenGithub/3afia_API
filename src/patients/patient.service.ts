import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HashService } from 'src/auth/hash.service';
import { Patient } from './patient.model';
import * as mongooseErrorHandler from 'mongoose-validation-error-message-handler';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel('Patient') private readonly patientDB: Model<Patient>,
    private readonly hashService: HashService,
  ) {}

  async insertPatient(
    name: string,
    gender: string,
    address: string,
    map_coordination: string,
    account_status: string,
    mobile: string,
    email: string,
    rawPassword: string,
  ) {
    try {
      const password = await this.hashService.encodePassword(rawPassword);
      const newPatient = new this.patientDB({
        name,
        gender,
        address,
        map_coordination,
        account_status,
        mobile,
        email,
        password,
      });
      const result = await newPatient.save();
      return result.id as string;
    } catch (e) {
      const mongooseErorr = mongooseErrorHandler(e);
      throw new ForbiddenException(mongooseErorr.toString());
    }
  }
  async getPatients() {
    const allPatients = await this.patientDB.find().exec();
    return allPatients.map((patient) => ({
      id: patient.id,
      name: patient.name,
      gender: patient.gender,
      address: patient.address,
      map_coordination: patient.map_coordination,
      account_status: patient.account_status,
      mobile: patient.mobile,
      email: patient.email,
    }));
  }
  async getSinglePatient(id: string) {
    const patient = await this.findPatient(id);
    return {
      id: patient.id,
      name: patient.name,
      gender: patient.gender,
      address: patient.address,
      map_coordination: patient.map_coordination,
      account_status: patient.account_status,
      mobile: patient.mobile,
      email: patient.email,
    };
  }
  async comparePatientPasswordHash(id: string, password: string) {
    const patient = await this.findPatient(id);
    if (await this.hashService.comparePassword(password, patient.password)) {
      return { message: 'Password matched!' };
    } else {
      throw new UnauthorizedException('Wrong Password');
    }
  }
  async updatePatient(
    id: string,
    name: string,
    gender: string,
    address: string,
    map_coordination: string,
    account_status: string,
    mobile: string,
    email: string,
    password: string,
  ) {
    const updatedPatient = await this.findPatient(id);
    if (name) updatedPatient.name = name;
    if (mobile) updatedPatient.mobile = mobile;
    if (email) updatedPatient.email = email;
    if (gender) updatedPatient.gender = gender;
    if (address) updatedPatient.address = address;
    if (map_coordination) updatedPatient.email = map_coordination;
    if (account_status) updatedPatient.account_status = account_status;
    if (password)
      updatedPatient.password = await this.hashService.encodePassword(password);
    await updatedPatient.save();
    return {
      id: updatedPatient.id,
      name: updatedPatient.name,
      gender: updatedPatient.gender,
      address: updatedPatient.address,
      map_coordination: updatedPatient.map_coordination,
      account_status: updatedPatient.account_status,
      mobile: updatedPatient.mobile,
      email: updatedPatient.email,
      password: updatedPatient.password,
    };
  }

  async deletePatient(id: string) {
    await this.patientDB.deleteOne({ _id: id }).exec();
    return { message: 'The patient has been deleted succesfully' };
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
}
