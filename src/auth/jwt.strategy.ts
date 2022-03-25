import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as dotenv from 'dotenv';
import { ClientService } from 'src/clients/clients.service';
import { MedicalStaffService } from 'src/medical_staff/medical_staff.service';
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly clientService: ClientService,
    private readonly medicalStaffService: MedicalStaffService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    });
  }

  async validate(req: Request, payload: any) {
    let requestedUser;
    switch (payload.role) {
      case 'client':
        requestedUser = await this.clientService.findClientByNationalID(
          payload?.national_id,
        );
        break;
      case 'medical_staff':
        requestedUser =
          await this.medicalStaffService.findMedicalStaffByNationalID(
            payload?.national_id,
          );
        break;
    }
    if (requestedUser) {
      const user = {
        national_id: requestedUser.national_id,
        name: requestedUser.name,
        role: requestedUser.role,
      };
      return user;
    }
    throw new NotFoundException();
  }
}
