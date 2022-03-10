import { KeyGeneratorService } from 'src/auth/key-generator.service';
import { PatientController } from './patient.controller';
import { forwardRef, Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientSchema } from './patient.model';
import { HashService } from 'src/auth/hash.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([{ name: 'Patient', schema: PatientSchema }]),
  ],
  controllers: [PatientController],
  providers: [PatientService, HashService, KeyGeneratorService],
  exports: [PatientService],
})
export class PatientModule {}
