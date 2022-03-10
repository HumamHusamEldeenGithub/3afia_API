import { Patient } from '../patients/patient.model';
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
    @Body('name') clientName: string,
    @Body('gender') clientGender: string,
    @Body('address') clientAddress: string,
    @Body('map_coordination') clientMap_Coordination: string,
    @Body('account_status') clientAccount_Status: string,
    @Body('mobile') clientMobile: string,
    @Body('email') clientEmail: string,
    @Body('patients') clientPatients: Patient[],
    @Body('password') clientPassword: string,
  ): Promise<any> {
    const access_token = await this.clientService.insertClient(
      clientName,
      clientGender,
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

  @UseGuards(JwtAuthGuard)
  @Get()
  async getClients(@Request() req): Promise<any> {
    const patientsList = await this.clientService.getClients();
    return patientsList;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getSingleClient(@Request() req, @Param('id') id: string): any {
    return this.clientService.getSingleClient(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateClient(
    @Request() req,
    @Param('id') id: string,
    @Body('name') clientName: string,
    @Body('gender') clientGender: string,
    @Body('address') clientAddress: string,
    @Body('map_coordination') clientMap_Coordination: string,
    @Body('account_status') clientAccount_Status: string,
    @Body('mobile') clientMobile: string,
    @Body('email') clientEmail: string,
    @Body('patients') clientPatients: Patient[],
    @Body('password') clientPassword: string,
  ) {
    return this.clientService.updateClient(
      id,
      clientName,
      clientGender,
      clientAddress,
      clientMap_Coordination,
      clientAccount_Status,
      clientMobile,
      clientEmail,
      clientPatients,
      clientPassword,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteClient(@Request() req, @Param('id') id: string) {
    this.clientService.deleteClient(id);
    return null;
  }
}
