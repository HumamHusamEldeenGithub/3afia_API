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
    const generatedId = await this.patientService.insertPatient(
      patientName,
      patientGender,
      patientAddress,
      patientMap_Coordination,
      patientAccount_Status,
      patientMobile,
      patientEmail,
      patientPassword,
    );
    return { id: generatedId };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getPatients(@Request() req): Promise<any> {
    const patientsList = await this.patientService.getPatients();
    return patientsList;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getSinglePatient(@Request() req, @Param('id') id: string): any {
    return this.patientService.getSinglePatient(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updatePatient(
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
  deletePatient(@Request() req, @Param('id') id: string) {
    this.patientService.deletePatient(id);
    return null;
  }
}