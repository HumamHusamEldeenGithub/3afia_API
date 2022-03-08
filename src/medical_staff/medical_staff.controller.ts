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
import { MedicalStaffService } from './medical_staff.service';

@Controller('medical_staff')
export class MedicalStaffController {
  constructor(private readonly medicalStaffService: MedicalStaffService) {}

  @Post()
  async addMedicalStaff(
    @Body('name') medicalStaffName: string,
    @Body('gender') medicalStaffGender: string,
    @Body('address') medicalStaffAddress: string,
    @Body('map_coordination') medicalStaffMap_Coordination: string,
    @Body('account_status') medicalStaffAccount_Status: string,
    @Body('mobile') medicalStaffMobile: string,
    @Body('email') medicalStaffEmail: string,
    @Body('password') medicalStaffPassword: string,
    @Body('specialization') medicalStaffSpecialization: string,
    @Body('medical_services') medicalStaffMedical_services: Array<any>,
    @Body('coveraged_areas') medicalStaffCoveraged_areas: Array<any>,
    @Body('deliveryed_consumables')
    medicalStaffDeliveryed_consumables: Array<any>,
    @Body('tasks') medicalStaffTasks: Array<any>,
  ): Promise<any> {
    const generatedId = await this.medicalStaffService.insertMedicalStaff(
      medicalStaffName,
      medicalStaffGender,
      medicalStaffAddress,
      medicalStaffMap_Coordination,
      medicalStaffAccount_Status,
      medicalStaffMobile,
      medicalStaffEmail,
      medicalStaffPassword,
      medicalStaffSpecialization,
      medicalStaffMedical_services,
      medicalStaffCoveraged_areas,
      medicalStaffDeliveryed_consumables,
      medicalStaffTasks,
    );
    return { id: generatedId };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMedicalStaff(@Request() req): Promise<any> {
    const medicalStaffList = await this.medicalStaffService.getMedicalStaff();
    return medicalStaffList;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getSingleMedicalStaff(@Request() req, @Param('id') id: string): any {
    return this.medicalStaffService.getSingleMedicalStaff(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateMedicalStaff(
    @Request() req,
    @Param('id') id: string,
    @Body('name') medicalStaffName: string,
    @Body('gender') medicalStaffGender: string,
    @Body('address') medicalStaffAddress: string,
    @Body('map_coordination') medicalStaffMap_Coordination: string,
    @Body('account_status') medicalStaffAccount_Status: string,
    @Body('mobile') medicalStaffMobile: string,
    @Body('email') medicalStaffEmail: string,
    @Body('password') medicalStaffPassword: string,
    @Body('specialization') medicalStaffSpecialization: string,
    @Body('medical_services') medicalStaffMedical_services: Array<any>,
    @Body('coveraged_areas') medicalStaffCoveraged_areas: Array<any>,
    @Body('deliveryed_consumables')
    medicalStaffDeliveryed_consumables: Array<any>,
    @Body('tasks') medicalStaffTasks: Array<any>,
  ) {
    return this.medicalStaffService.updateMedicalStaff(
      id,
      medicalStaffName,
      medicalStaffGender,
      medicalStaffAddress,
      medicalStaffMap_Coordination,
      medicalStaffAccount_Status,
      medicalStaffMobile,
      medicalStaffEmail,
      medicalStaffPassword,
      medicalStaffSpecialization,
      medicalStaffMedical_services,
      medicalStaffCoveraged_areas,
      medicalStaffDeliveryed_consumables,
      medicalStaffTasks,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteMedicalStaff(@Request() req, @Param('id') id: string) {
    this.medicalStaffService.deleteMedicalStaff(id);
    return null;
  }
}