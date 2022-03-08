import { MedicalStaffController } from './medical_staff.controller';
import { Module } from '@nestjs/common';
import { MedicalStaffService } from './medical_staff.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicalStaffSchema } from './medical_staff.model';
import { HashService } from 'src/auth/hash.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'MedicalStaff', schema: MedicalStaffSchema },
    ]),
  ],
  controllers: [MedicalStaffController],
  providers: [MedicalStaffService, HashService],
  exports: [MedicalStaffService],
})
export class MedicalStaffModule {}
