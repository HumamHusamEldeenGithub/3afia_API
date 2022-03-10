import { MedicalStaffController } from './medical_staff.controller';
import { forwardRef, Module } from '@nestjs/common';
import { MedicalStaffService } from './medical_staff.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicalStaffSchema } from './medical_staff.model';
import { HashService } from 'src/auth/hash.service';
import { KeyGeneratorService } from 'src/auth/key-generator.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([
      { name: 'MedicalStaff', schema: MedicalStaffSchema },
    ]),
  ],
  controllers: [MedicalStaffController],
  providers: [MedicalStaffService, HashService, KeyGeneratorService],
  exports: [MedicalStaffService],
})
export class MedicalStaffModule {}
