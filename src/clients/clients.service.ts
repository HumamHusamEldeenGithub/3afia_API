import { AuthService } from './../auth/auth.service';
import {
  ForbiddenException,
  forwardRef,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HashService } from 'src/auth/hash.service';
import { Client } from './clients.model';
import { Model } from 'mongoose';
import * as mongooseErrorHandler from 'mongoose-validation-error-message-handler';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

export class ClientService {
  constructor(
    @InjectModel('Client') private readonly clientDB: Model<Client>,
    private readonly hashService: HashService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  async insertClient(
    name: string,
    gender: string,
    address: string,
    map_coordination: string,
    account_status: string,
    mobile: string,
    email: string,
    patients: Array<any>,
    rawPassword: string,
  ) {
    try {
      const password = await this.hashService.encodeString(rawPassword);

      const role = 'client';
      const newClient = new this.clientDB({
        name,
        role,
        gender,
        address,
        map_coordination,
        account_status,
        mobile,
        email,
        patients,
        password,
      });
      await newClient.save();
      const payload = {
        email: newClient.email,
        id: newClient.id,
        role: newClient.role,
      };
      const refresh_token = await this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
      const hashed_refresh_token = await this.hashService.encodeString(
        refresh_token,
      );
      newClient.hashed_refresh_token = hashed_refresh_token;
      await newClient.save();
      return this.authService.login(newClient);
    } catch (e) {
      const mongooseErorr = mongooseErrorHandler(e);
      throw new ForbiddenException(mongooseErorr.toString());
    }
  }
  async getClients() {
    const allClients = await this.clientDB.find().exec();
    return allClients.map((client) => ({
      id: client.id,
      name: client.name,
      role: client.role,
      gender: client.gender,
      address: client.address,
      map_coordination: client.map_coordination,
      account_status: client.account_status,
      mobile: client.mobile,
      patients: client.patients,
      email: client.email,
      password: client.password,
      hashed_refresh_token: client.hashed_refresh_token,
    }));
  }
  async getSingleClient(id: string) {
    const client = await this.findClient(id);
    return {
      id: client.id,
      name: client.name,
      role: client.role,
      gender: client.gender,
      address: client.address,
      map_coordination: client.map_coordination,
      account_status: client.account_status,
      mobile: client.mobile,
      patients: client.patients,
      email: client.email,
      password: client.password,
      hashed_refresh_token: client.hashed_refresh_token,
    };
  }

  async updateClient(
    id: string,
    name: string,
    gender: string,
    address: string,
    map_coordination: string,
    account_status: string,
    mobile: string,
    email: string,
    patients: any,
    password: string,
  ) {
    const updatedClient = await this.findClient(id);
    if (name) updatedClient.name = name;
    if (mobile) updatedClient.mobile = mobile;
    if (email) updatedClient.email = email;
    if (gender) updatedClient.gender = gender;
    if (address) updatedClient.address = address;
    if (map_coordination) updatedClient.email = map_coordination;
    if (account_status) updatedClient.account_status = account_status;
    if (patients) updatedClient.patients = patients;
    if (password)
      updatedClient.password = await this.hashService.encodeString(password);
    await updatedClient.save();
    return {
      id: updatedClient.id,
      name: updatedClient.name,
      gender: updatedClient.gender,
      address: updatedClient.address,
      map_coordination: updatedClient.map_coordination,
      account_status: updatedClient.account_status,
      mobile: updatedClient.mobile,
      email: updatedClient.email,
      patients: updatedClient.patients,
      password: updatedClient.password,
    };
  }

  async deleteClient(id: string) {
    await this.clientDB.deleteOne({ _id: id }).exec();
    return { message: 'Client has been deleted successfully' };
  }

  async findClient(id: string): Promise<Client> {
    let reqClient;
    try {
      reqClient = await this.clientDB.findById(id);
    } catch (e) {
      throw new NotFoundException('Could not find Client');
    }
    if (!reqClient) {
      throw new NotFoundException('Could not find Client');
    }
    return reqClient;
  }

  async findClientByEmail(userEmail: string): Promise<Client> {
    let reqClient;
    try {
      reqClient = await this.clientDB.findOne({ email: userEmail });
    } catch (e) {
      throw new NotFoundException('Could not find Client');
    }
    if (!reqClient) {
      throw new NotFoundException('Could not find Client');
    }
    return reqClient;
  }

  async changeHashedRefreshToken(id: string) {
    const updatedClient = await this.findClient(id);
    const payload = {
      email: updatedClient.email,
      id: updatedClient.id,
      role: updatedClient.role,
    };
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
    });
    const hashed_refresh_token = await this.hashService.encodeString(
      refresh_token,
    );
    updatedClient.hashed_refresh_token = hashed_refresh_token;
    await updatedClient.save();
    return hashed_refresh_token;
  }

  async removeHashedRefreshToken(id: string) {
    const updatedClient = await this.findClient(id);
    updatedClient.hashed_refresh_token = null;
    await updatedClient.save();
  }
}
