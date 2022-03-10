import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { AuthService } from './auth.service';
import { ClientService } from 'src/clients/clients.service';
import { PatientService } from 'src/patients/patient.service';
import { MedicalStaffService } from 'src/medical_staff/medical_staff.service';
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly clientService: ClientService,
    private readonly patientService: PatientService,
    private readonly medicalStaffService: MedicalStaffService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: async (request, jwtToken, done) => {
        try {
          const decodedToken: any = jwt.decode(jwtToken);
          let user;
          switch (decodedToken.type) {
            case 'client':
              user = await this.clientService.findClient(decodedToken?.id);
              break;
            case 'patient':
              user = await this.patientService.findPatient(decodedToken?.id);
              break;
            case 'medical_staff':
              user = await this.medicalStaffService.findMedicalStaff(
                decodedToken?.id,
              );
              break;
          }
          done(null, user.secret_key);
        } catch (e) {
          done(true, null);
        }
      },
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
