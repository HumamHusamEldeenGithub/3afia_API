import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as dotenv from 'dotenv';
import { ClientService } from 'src/clients/clients.service';
import { MedicalStaffService } from 'src/medical_staff/medical_staff.service';
import { HashService } from './hash.service';
import { AuthService } from './auth.service';
dotenv.config();

@Injectable()
export class JWTRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly authService: AuthService,
    private readonly clientService: ClientService,
    private readonly medicalStaffService: MedicalStaffService,
    private readonly hashService: HashService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
    });
  }

  async validate(req: Request, payload: any) {
    let requestedUser;
    switch (payload.role) {
      case 'client':
        requestedUser = await this.clientService.findClient(payload?.id);
        break;
      case 'medical_staff':
        requestedUser = await this.medicalStaffService.findMedicalStaff(
          payload?.id,
        );
        break;
    }
    if (requestedUser) {
      const authHeader = req.headers['authorization'];
      const token = authHeader.split(' ')[1];
      if (
        !(await this.hashService.compareHash(
          token,
          requestedUser.hashed_refresh_token,
        ))
      ) {
        throw new UnauthorizedException();
      }
      return await this.authService.login(requestedUser);
    }
    throw new NotFoundException();
  }
}
