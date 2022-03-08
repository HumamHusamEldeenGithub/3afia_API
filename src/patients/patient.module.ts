import { PatientController } from './patient.controller';
import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientSchema } from './patient.model';
import { HashService } from 'src/auth/hash.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Patient', schema: PatientSchema }]),
  ],
  controllers: [PatientController],
  providers: [PatientService, HashService],
  exports: [PatientService],
})
export class PatientModule {}
