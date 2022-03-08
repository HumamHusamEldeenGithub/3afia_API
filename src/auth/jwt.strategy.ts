import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET,
    });
  }

  async validate(payload: any) {
    // TODO : get the user from database
    return {
      id: payload.id,
      name: payload.name,
    };
  }
}
/*import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { MedicalStaffModule } from './../medical_staff/medical_staff.module';
import { PatientModule } from './../patients/patient.module';
import { HashService } from 'src/auth/hash.service';
import { ClientModule } from '../clients/clients.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    ClientModule,
    PatientModule,
    MedicalStaffModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('SECRET'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, HashService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
 */