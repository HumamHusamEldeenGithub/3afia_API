import { JwtStrategy } from './jwt.strategy';
import { MedicalStaffModule } from './../medical_staff/medical_staff.module';
import { PatientModule } from './../patients/patient.module';
import { HashService } from 'src/auth/hash.service';
import { ClientModule } from '../clients/clients.module';
import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { MedicalServiceService } from 'src/medical_service/medical_service.service';
dotenv.config();

@Module({
  imports: [
    forwardRef(() => ClientModule),
    forwardRef(() => PatientModule),
    forwardRef(() => MedicalStaffModule),
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, HashService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
