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
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { MedicalStaffService } from './medical_staff.service';

@Controller('medical_staff')
export class MedicalStaffController {
  constructor(private readonly medicalStaffService: MedicalStaffService) {}

  @Post()
  async addMedicalStaff(
    @Body('national_id') medicalStaffNationalID: string,
    @Body('name') medicalStaffName: string,
    @Body('gender') medicalStaffGender: string,
    @Body('birthdate') medicalStaffBirthdate: number,
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
    const access_token = await this.medicalStaffService.insertMedicalStaff(
      medicalStaffNationalID,
      medicalStaffName,
      medicalStaffGender,
      medicalStaffBirthdate,
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
    return access_token;
  }

  @Roles(Role.Medical_Staff, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async getMedicalStaff(@Request() req): Promise<any> {
    const medicalStaffList = await this.medicalStaffService.getMedicalStaff();
    return medicalStaffList;
  }

  @Roles(Role.Medical_Staff, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':national_id')
  async getSingleMedicalStaff(
    @Request() req,
    @Param('national_id') national_id: string,
  ): Promise<any> {
    return this.medicalStaffService.getSingleMedicalStaff(national_id);
  }

  @Roles(Role.Medical_Staff, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':national_id')
  async updateMedicalStaff(
    @Request() req,
    @Param('national_id') medicalStaffNationalID: string,
    @Body('name') medicalStaffName: string,
    @Body('gender') medicalStaffGender: string,
    @Body('birthdate') medicalStaffBirthdate: number,
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
      medicalStaffNationalID,
      medicalStaffName,
      medicalStaffGender,
      medicalStaffBirthdate,
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

  @Roles(Role.Medical_Staff, Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':national_id')
  async deleteMedicalStaff(
    @Request() req,
    @Param('national_id') national_id: string,
  ) {
    return this.medicalStaffService.deleteMedicalStaff(national_id);
  }
}
