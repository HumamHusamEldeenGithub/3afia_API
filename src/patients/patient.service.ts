import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HashService } from 'src/auth/hash.service';
import { Patient } from './patient.model';
import * as mongooseErrorHandler from 'mongoose-validation-error-message-handler';
import { KeyGeneratorService } from 'src/auth/key-generator.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel('Patient') private readonly patientDB: Model<Patient>,
    private readonly hashService: HashService,
    private readonly keyGeneretorService: KeyGeneratorService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
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
      const type = 'patient';
      const newPatient = new this.patientDB({
        name,
        type,
        gender,
        address,
        map_coordination,
        account_status,
        mobile,
        email,
        password,
      });
      await newPatient.save();
      return this.authService.login(newPatient);
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
      type: patient.type,
      gender: patient.gender,
      address: patient.address,
      map_coordination: patient.map_coordination,
      account_status: patient.account_status,
      mobile: patient.mobile,
      email: patient.email,
      secret_key: patient.secret_key,
    }));
  }
  async getSinglePatient(id: string) {
    const patient = await this.findPatient(id);
    return {
      id: patient.id,
      name: patient.name,
      type: patient.type,
      gender: patient.gender,
      address: patient.address,
      map_coordination: patient.map_coordination,
      account_status: patient.account_status,
      mobile: patient.mobile,
      email: patient.email,
      secret_key: patient.secret_key,
    };
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

  async changeSecretKey(id: string) {
    const updatedPatient = await this.findPatient(id);
    const secret_key = await this.keyGeneretorService.generate();
    updatedPatient.secret_key = secret_key;
    await updatedPatient.save();
    return secret_key;
  }

  async deletePatient(id: string) {
    await this.patientDB.deleteOne({ _id: id }).exec();
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
