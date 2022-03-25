import { RolesGuard } from './../roles/roles.guard';
import { Role } from './../roles/roles.enum';
import { Roles } from './../roles/roles.decorator';
import {
  Controller,
  Request,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ClientService } from './clients.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  async addClient(
    @Body('national_id') clientNationalID: string,
    @Body('name') clientName: string,
    @Body('gender') clientGender: string,
    @Body('birthdate') clientBirthdate: number,
    @Body('address') clientAddress: string,
    @Body('map_coordination') clientMap_Coordination: string,
    @Body('account_status') clientAccount_Status: string,
    @Body('mobile') clientMobile: string,
    @Body('email') clientEmail: string,
    @Body('patients') clientPatients: Array<any>,
    @Body('password') clientPassword: string,
  ): Promise<any> {
    const access_token = await this.clientService.insertClient(
      clientNationalID,
      clientName,
      clientGender,
      clientBirthdate,
      clientAddress,
      clientMap_Coordination,
      clientAccount_Status,
      clientMobile,
      clientEmail,
      clientPatients,
      clientPassword,
    );
    return access_token;
  }

  @Roles(Role.Client, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async getClients(@Request() req): Promise<any> {
    const patientsList = await this.clientService.getClients();
    return patientsList;
  }

  @Roles(Role.Client, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':national_id')
  async getSingleClient(
    @Request() req,
    @Param('national_id') national_id: string,
  ): Promise<any> {
    return this.clientService.getSingleClient(national_id);
  }

  @Roles(Role.Client, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':national_id')
  async updateClient(
    @Request() req,
    @Param('national_id') national_id: string,
    @Body('name') clientName: string,
    @Body('gender') clientGender: string,
    @Body('birthdate') clientBirthdate: number,
    @Body('address') clientAddress: string,
    @Body('map_coordination') clientMap_Coordination: string,
    @Body('account_status') clientAccount_Status: string,
    @Body('mobile') clientMobile: string,
    @Body('email') clientEmail: string,
    @Body('patients') clientPatients: Array<any>,
    @Body('password') clientPassword: string,
  ) {
    return this.clientService.updateClient(
      national_id,
      clientName,
      clientGender,
      clientBirthdate,
      clientAddress,
      clientMap_Coordination,
      clientAccount_Status,
      clientMobile,
      clientEmail,
      clientPatients,
      clientPassword,
    );
  }

  @Roles(Role.Client, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':national_id')
  async deleteClient(
    @Request() req,
    @Param('national_id') national_id: string,
  ) {
    return this.clientService.deleteClient(national_id);
  }
}
