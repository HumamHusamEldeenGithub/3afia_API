import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HashService } from 'src/auth/hash.service';
import { MedicalStaff } from './medical_staff.model';
import * as mongooseErrorHandler from 'mongoose-validation-error-message-handler';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MedicalStaffService {
  constructor(
    @InjectModel('MedicalStaff')
    private readonly medicalStaffDB: Model<MedicalStaff>,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async insertMedicalStaff(
    national_id: string,
    name: string,
    gender: string,
    birthdate: number,
    address: string,
    map_coordination: string,
    account_status: string,
    mobile: string,
    email: string,
    rawPassword: string,
    specialization: string,
    medical_services: Array<any>,
    coveraged_areas: Array<any>,
    deliveryed_consumables: Array<any>,
    tasks: Array<any>,
  ) {
    try {
      const password = await this.hashService.encodeString(rawPassword);
      const role = 'medical_staff';
      const newMedicalStaff = new this.medicalStaffDB({
        national_id,
        name,
        role,
        gender,
        birthdate,
        address,
        map_coordination,
        account_status,
        mobile,
        email,
        password,
        specialization,
        medical_services,
        coveraged_areas,
        deliveryed_consumables,
        tasks,
      });
      await newMedicalStaff.save();

      const payload = {
        email: newMedicalStaff.email,
        national_id: newMedicalStaff.national_id,
        role: newMedicalStaff.role,
      };
      const refresh_token = await this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
      const hashed_refresh_token = await this.hashService.encodeString(
        refresh_token,
      );
      newMedicalStaff.hashed_refresh_token = hashed_refresh_token;
      await newMedicalStaff.save();

      return this.authService.login(newMedicalStaff);
    } catch (e) {
      const mongooseErorr = mongooseErrorHandler(e);
      throw new ForbiddenException(mongooseErorr.toString());
    }
  }
  async getMedicalStaff() {
    const allMedicalStaff = await this.medicalStaffDB.find().exec();
    return allMedicalStaff.map((medicalStaff) => ({
      national_id: medicalStaff.national_id,
      name: medicalStaff.name,
      role: medicalStaff.role,
      gender: medicalStaff.gender,
      birthdate: medicalStaff.birthdate,
      address: medicalStaff.address,
      map_coordination: medicalStaff.map_coordination,
      account_status: medicalStaff.account_status,
      mobile: medicalStaff.mobile,
      email: medicalStaff.email,
      specialization: medicalStaff.specialization,
      medical_services: medicalStaff.medical_services,
      coveraged_areas: medicalStaff.coveraged_areas,
      deliveryed_consumables: medicalStaff.deliveryed_consumables,
      tasks: medicalStaff.tasks,
      hashed_refresh_token: medicalStaff.hashed_refresh_token,
    }));
  }
  async getSingleMedicalStaff(national_id: string) {
    const medicalStaff = await this.findMedicalStaffByNationalID(national_id);
    return {
      national_id: medicalStaff.national_id,
      name: medicalStaff.name,
      role: medicalStaff.role,
      gender: medicalStaff.gender,
      birthdate: medicalStaff.birthdate,
      address: medicalStaff.address,
      map_coordination: medicalStaff.map_coordination,
      account_status: medicalStaff.account_status,
      mobile: medicalStaff.mobile,
      email: medicalStaff.email,
      specialization: medicalStaff.specialization,
      medical_services: medicalStaff.medical_services,
      coveraged_areas: medicalStaff.coveraged_areas,
      deliveryed_consumables: medicalStaff.deliveryed_consumables,
      tasks: medicalStaff.tasks,
      hashed_refresh_token: medicalStaff.hashed_refresh_token,
    };
  }

  async updateMedicalStaff(
    national_id: string,
    name: string,
    gender: string,
    birthdate: number,
    address: string,
    map_coordination: string,
    account_status: string,
    mobile: string,
    email: string,
    password: string,
    specialization: string,
    medical_services: Array<any>,
    coveraged_areas: Array<any>,
    deliveryed_consumables: Array<any>,
    tasks: Array<any>,
  ) {
    const medicalStaff = await this.findMedicalStaffByNationalID(national_id);
    if (name) medicalStaff.name = name;
    if (mobile) medicalStaff.mobile = mobile;
    if (email) medicalStaff.email = email;
    if (gender) medicalStaff.gender = gender;
    if (birthdate) medicalStaff.birthdate = birthdate;
    if (address) medicalStaff.address = address;
    if (map_coordination) medicalStaff.email = map_coordination;
    if (account_status) medicalStaff.account_status = account_status;
    if (specialization) medicalStaff.specialization = specialization;
    if (medical_services) medicalStaff.medical_services = medical_services;
    if (password)
      medicalStaff.password = await this.hashService.encodeString(password);
    if (coveraged_areas) medicalStaff.coveraged_areas = coveraged_areas;
    if (deliveryed_consumables)
      medicalStaff.deliveryed_consumables = deliveryed_consumables;
    if (tasks) medicalStaff.tasks = tasks;
    await medicalStaff.save();
    return {
      national_id: medicalStaff.national_id,
      name: medicalStaff.name,
      gender: medicalStaff.gender,
      birthdate: medicalStaff.birthdate,
      address: medicalStaff.address,
      map_coordination: medicalStaff.map_coordination,
      account_status: medicalStaff.account_status,
      mobile: medicalStaff.mobile,
      email: medicalStaff.email,
      specialization: medicalStaff.specialization,
      medical_services: medicalStaff.medical_services,
      coveraged_areas: medicalStaff.coveraged_areas,
      deliveryed_consumables: medicalStaff.deliveryed_consumables,
      tasks: medicalStaff.tasks,
    };
  }

  async deleteMedicalStaff(userNational_id: string) {
    await this.medicalStaffDB
      .deleteOne({ national_id: userNational_id })
      .exec();
    return { message: 'Medical member has been deleted successfully' };
  }

  async findMedicalStaff(id: string): Promise<MedicalStaff> {
    let reqMedicalStaff;
    try {
      reqMedicalStaff = await this.medicalStaffDB.findById(id);
    } catch (e) {
      throw new NotFoundException('Could not find MedicalStaff');
    }
    if (!reqMedicalStaff) {
      throw new NotFoundException('Could not find MedicalStaff');
    }
    return reqMedicalStaff;
  }

  async findMedicalStaffByNationalID(
    userNationalID: string,
  ): Promise<MedicalStaff> {
    let reqMedicalStaff;
    try {
      reqMedicalStaff = await this.medicalStaffDB.findOne({
        national_id: userNationalID,
      });
    } catch (e) {
      throw new NotFoundException('Could not find MedicalStaff');
    }
    if (!reqMedicalStaff) {
      throw new NotFoundException('Could not find MedicalStaff');
    }
    return reqMedicalStaff;
  }

  async findMedicalStaffByEmail(userEmail: string): Promise<MedicalStaff> {
    let reqMedicalStaff;
    try {
      reqMedicalStaff = await this.medicalStaffDB.findOne({ email: userEmail });
    } catch (e) {
      throw new NotFoundException('Could not find MedicalStaff');
    }
    if (!reqMedicalStaff) {
      throw new NotFoundException('Could not find MedicalStaff');
    }
    return reqMedicalStaff;
  }

  async changeHashedRefreshToken(national_id: string) {
    const medicalStaff = await this.findMedicalStaffByNationalID(national_id);
    const payload = {
      email: medicalStaff.email,
      national_id: medicalStaff.national_id,
      role: medicalStaff.role,
    };
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
    });
    const hashed_refresh_token = await this.hashService.encodeString(
      refresh_token,
    );
    medicalStaff.hashed_refresh_token = hashed_refresh_token;
    await medicalStaff.save();
    return hashed_refresh_token;
  }

  async removeHashedRefreshToken(national_id: string) {
    const medicalStaff = await this.findMedicalStaffByNationalID(national_id);
    medicalStaff.hashed_refresh_token = null;
    await medicalStaff.save();
  }
}
