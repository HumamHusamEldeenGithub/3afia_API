import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientService } from '../clients/clients.service';
import { MedicalStaffService } from 'src/medical_staff/medical_staff.service';
import { HashService } from './hash.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => ClientService))
    private readonly clientService: ClientService,
    @Inject(forwardRef(() => MedicalStaffService))
    private readonly medicalStaffService: MedicalStaffService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string, role: string) {
    let user;
    switch (role) {
      case 'client':
        user = await this.clientService.findClientByEmail(email);
        break;
      case 'medical_staff':
        user = await this.medicalStaffService.findMedicalStaffByEmail(email);
        break;
    }
    if (await this.hashService.compareHash(password, user.password)) {
      return user;
    } else {
      throw new UnauthorizedException('Wrong Password');
    }
  }

  async login(user: any) {
    const payload = { email: user.email, id: user.id, role: user.role };
    // TODO : Unit testing
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
      }),
      refresh_token: this.jwtService.sign(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
      }),
    };
  }

  async logout(user: any) {
    switch (user.role) {
      case 'client':
        return await this.clientService.removeHashedRefreshToken(user.id);
      case 'medical_staff':
        return await this.medicalStaffService.removeHashedRefreshToken(user.id);
    }
    throw new UnauthorizedException('Wrong Credentials');
  }
}
