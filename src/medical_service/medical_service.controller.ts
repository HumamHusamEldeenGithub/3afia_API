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
import { MedicalServiceService } from './medical_service.service';

@Controller('medical_services')
export class MedicalServiceController {
  constructor(private readonly medicalServiceService: MedicalServiceService) {}

  @Post()
  async addMedicalService(
    @Body('name') MedicalServiceName: string,
    @Body('category') MedicalServiceCategory: string,
    @Body('perquisites') MedicalServicePerquisites: Array<any>,
    @Body('tools') MedicalServiceTools: Array<any>,
    @Body('consumables') MedicalServiceConsumables: Array<any>,
    @Body('price') MedicalServicePrice: string,
  ): Promise<any> {
    return {
      id: await this.medicalServiceService.insertMedicalService(
        MedicalServiceName,
        MedicalServiceCategory,
        MedicalServicePerquisites,
        MedicalServiceTools,
        MedicalServiceConsumables,
        MedicalServicePrice,
      ),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMedicalServices(): Promise<any> {
    const medicalServicesList =
      await this.medicalServiceService.getMedicalServices();
    return medicalServicesList;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getSingleMedicalService(
    @Request() req,
    @Param('id') id: string,
  ): Promise<any> {
    return this.medicalServiceService.getSingleMedicalService(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateMedicalService(
    @Request() req,
    @Param('id') id: string,
    @Body('name') MedicalServiceName: string,
    @Body('category') MedicalServiceCategory: string,
    @Body('perquisites') MedicalServicePerquisites: Array<any>,
    @Body('tools') MedicalServiceTools: Array<any>,
    @Body('consumables') MedicalServiceConsumables: Array<any>,
    @Body('price') MedicalServicePrice: string,
  ) {
    return {
      id: this.medicalServiceService.updateMedicalService(
        id,
        MedicalServiceName,
        MedicalServiceCategory,
        MedicalServicePerquisites,
        MedicalServiceTools,
        MedicalServiceConsumables,
        MedicalServicePrice,
      ),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteMedicalService(@Request() req, @Param('id') id: string) {
    return this.medicalServiceService.deleteMedicalService(id);
  }
}
