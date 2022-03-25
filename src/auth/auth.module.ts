import { JwtStrategy } from './jwt.strategy';
import { MedicalStaffModule } from './../medical_staff/medical_staff.module';
import { HashService } from 'src/auth/hash.service';
import { ClientModule } from '../clients/clients.module';
import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { JWTRefreshStrategy } from './jwt-refresh.strategy';
import { PatientModule } from 'src/patients/patient.module';
dotenv.config();

@Module({
  imports: [
    forwardRef(() => ClientModule),
    forwardRef(() => PatientModule),
    forwardRef(() => MedicalStaffModule),
    PassportModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION },
    }),
  ],
  providers: [
    AuthService,
    HashService,
    LocalStrategy,
    JwtStrategy,
    JWTRefreshStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
