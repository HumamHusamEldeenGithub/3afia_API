import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HashService } from 'src/auth/hash.service';
import { Patient } from 'src/patients/patient.model';
import { Client } from './clients.model';
import { Model } from 'mongoose';
import * as mongooseErrorHandler from 'mongoose-validation-error-message-handler';

export class ClientService {
  constructor(
    @InjectModel('Client') private readonly clientDB: Model<Client>,
    private readonly hashService: HashService,
  ) {}

  async insertClient(
    name: string,
    gender: string,
    address: string,
    map_coordination: string,
    account_status: string,
    mobile: string,
    email: string,
    patients: Patient[],
    rawPassword: string,
  ) {
    try {
      const password = await this.hashService.encodePassword(rawPassword);
      const newClient = new this.clientDB({
        name,
        gender,
        address,
        map_coordination,
        account_status,
        mobile,
        email,
        patients,
        password,
      });
      const result = await newClient.save();
      return result.id as string;
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
      gender: client.gender,
      address: client.address,
      map_coordination: client.map_coordination,
      account_status: client.account_status,
      mobile: client.mobile,
      patients: client.patients,
      email: client.email,
      password: client.password,
    }));
  }
  async getSingleClient(id: string) {
    const client = await this.findClient(id);
    return {
      id: client.id,
      name: client.name,
      gender: client.gender,
      address: client.address,
      map_coordination: client.map_coordination,
      account_status: client.account_status,
      mobile: client.mobile,
      patients: client.patients,
      email: client.email,
    };
  }
  // async compareClientPasswordHash(id: string, password: string) {
  //   const client = await this.findClient(id);
  //   if (await this.hashService.comparePassword(password, client.password)) {
  //     return { message: 'Password matched!' };
  //   } else {
  //     throw new UnauthorizedException('Wrong Password');
  //   }
  // }
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
      updatedClient.password = await this.hashService.encodePassword(password);
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
    return { message: 'The client has been deleted succesfully' };
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

  //TODO : create add and delete patient
}
