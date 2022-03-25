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
import { RolesGuard } from 'src/roles/roles.guard';
import { PatientService } from './patient.service';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  async addPatient(
    @Body('national_id') patientNationalID: string,
    @Body('name') patientName: string,
    @Body('gender') patientGender: string,
    @Body('birthdate') patientBirthdate: number,
    @Body('address') patientAddress: string,
    @Body('map_coordination') patientMap_Coordination: string,
    @Body('mobile') patientMobile: string,
    @Body('email') patientEmail: string,
  ): Promise<any> {
    const access_token = await this.patientService.insertPatient(
      patientNationalID,
      patientName,
      patientGender,
      patientBirthdate,
      patientAddress,
      patientMap_Coordination,
      patientMobile,
      patientEmail,
    );
    return access_token;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async getPatients(@Request() req): Promise<any> {
    const patientsList = await this.patientService.getPatients();
    return patientsList;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':national_id')
  async getSinglePatient(
    @Request() req,
    @Param('national_id') national_id: string,
  ): Promise<any> {
    return this.patientService.getSinglePatient(national_id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':national_id')
  async updatePatient(
    @Request() req,
    @Param('national_id') national_id: string,
    @Body('name') patientName: string,
    @Body('gender') patientGender: string,
    @Body('birthdate') patientBirthdate: number,
    @Body('address') patientAddress: string,
    @Body('map_coordination') patientMap_Coordination: string,
    @Body('mobile') patientMobile: string,
    @Body('email') patientEmail: string,
  ) {
    return this.patientService.updatePatient(
      national_id,
      patientName,
      patientGender,
      patientBirthdate,
      patientAddress,
      patientMap_Coordination,
      patientMobile,
      patientEmail,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':national_id')
  async deletePatient(
    @Request() req,
    @Param('national_id') national_id: string,
  ) {
    return this.patientService.deletePatient(national_id);
  }
}
