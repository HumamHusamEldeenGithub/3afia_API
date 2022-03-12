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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PatientService } from './patient.service';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  async addPatient(
    @Body('name') patientName: string,
    @Body('gender') patientGender: string,
    @Body('address') patientAddress: string,
    @Body('map_coordination') patientMap_Coordination: string,
    @Body('account_status') patientAccount_Status: string,
    @Body('mobile') patientMobile: string,
    @Body('email') patientEmail: string,
    @Body('password') patientPassword: string,
  ): Promise<any> {
    const access_token = await this.patientService.insertPatient(
      patientName,
      patientGender,
      patientAddress,
      patientMap_Coordination,
      patientAccount_Status,
      patientMobile,
      patientEmail,
      patientPassword,
    );
    return access_token;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getPatients(@Request() req): Promise<any> {
    const patientsList = await this.patientService.getPatients();
    return patientsList;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getSinglePatient(
    @Request() req,
    @Param('id') id: string,
  ): Promise<any> {
    return this.patientService.getSinglePatient(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updatePatient(
    @Request() req,
    @Param('id') id: string,
    @Body('name') patientName: string,
    @Body('gender') patientGender: string,
    @Body('address') patientAddress: string,
    @Body('map_coordination') patientMap_Coordination: string,
    @Body('account_status') patientAccount_Status: string,
    @Body('mobile') patientMobile: string,
    @Body('email') patientEmail: string,
    @Body('password') patientPassword: string,
  ) {
    return this.patientService.updatePatient(
      id,
      patientName,
      patientGender,
      patientAddress,
      patientMap_Coordination,
      patientAccount_Status,
      patientMobile,
      patientEmail,
      patientPassword,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePatient(@Request() req, @Param('id') id: string) {
    return this.patientService.deletePatient(id);
  }
}
