import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongooseErrorHandler from 'mongoose-validation-error-message-handler';
import { MedicalService } from './medical_service.model';
import { Model } from 'mongoose';
export class MedicalServiceService {
  constructor(
    @InjectModel('MedicalService')
    private readonly medicalServiceDB: Model<MedicalService>,
  ) {}

  async insertMedicalService(
    name: string,
    category: string,
    perquisites: Array<any>,
    tools: Array<any>,
    consumables: Array<any>,
    price: string,
  ) {
    try {
      const newMedicalService = new this.medicalServiceDB({
        name,
        category,
        perquisites,
        tools,
        consumables,
        price,
      });
      await newMedicalService.save();
      return newMedicalService.id as string;
    } catch (e) {
      const mongooseErorr = mongooseErrorHandler(e);
      throw new ForbiddenException(mongooseErorr.toString());
    }
  }
  async getMedicalServices() {
    const allMedicalServices = await this.medicalServiceDB.find().exec();
    return allMedicalServices.map((medicalService) => ({
      id: medicalService.id,
      name: medicalService.name,
      category: medicalService.category,
      perquisites: medicalService.perquisites,
      tools: medicalService.tools,
      consumables: medicalService.consumables,
      price: medicalService.price,
    }));
  }
  async getSingleMedicalService(id: string) {
    const medicalService = await this.findMedicalService(id);
    return {
      id: medicalService.id,
      name: medicalService.name,
      category: medicalService.category,
      perquisites: medicalService.perquisites,
      tools: medicalService.tools,
      consumables: medicalService.consumables,
      price: medicalService.price,
    };
  }

  async updateMedicalService(
    id: string,
    name: string,
    category: string,
    perquisites: Array<any>,
    tools: Array<any>,
    consumables: Array<any>,
    price: string,
  ) {
    const updatedMedicalService = await this.findMedicalService(id);
    if (name) updatedMedicalService.name = name;
    if (category) updatedMedicalService.category = category;
    if (perquisites) updatedMedicalService.perquisites = perquisites;
    if (tools) updatedMedicalService.tools = tools;
    if (consumables) updatedMedicalService.consumables = consumables;
    if (price) updatedMedicalService.price = price;
    await updatedMedicalService.save();
    return {
      id: updatedMedicalService.id,
      name: updatedMedicalService.name,
      category: updatedMedicalService.category,
      perquisites: updatedMedicalService.perquisites,
      tools: updatedMedicalService.tools,
      consumables: updatedMedicalService.consumables,
      price: updatedMedicalService.price,
    };
  }

  async deleteMedicalService(id: string) {
    await this.medicalServiceDB.deleteOne({ _id: id }).exec();
    return { message: 'Medical Service has been deleted successfully' };
  }

  async findMedicalService(id: string): Promise<MedicalService> {
    let reqMedicalService;
    try {
      reqMedicalService = await this.medicalServiceDB.findById(id);
    } catch (e) {
      throw new NotFoundException('Could not find MedicalService');
    }
    if (!reqMedicalService) {
      throw new NotFoundException('Could not find MedicalService');
    }
    return reqMedicalService;
  }
}
