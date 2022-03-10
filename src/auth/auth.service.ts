import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientService } from '../clients/clients.service';
import { MedicalStaffService } from 'src/medical_staff/medical_staff.service';
import { PatientService } from 'src/patients/patient.service';
import { HashService } from './hash.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => ClientService))
    private readonly clientService: ClientService,
    @Inject(forwardRef(() => PatientService))
    private readonly patientService: PatientService,
    @Inject(forwardRef(() => MedicalStaffService))
    private readonly medicalStaffService: MedicalStaffService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string, type: string) {
    let user;
    switch (type) {
      case 'client':
        user = await this.clientService.findClientByEmail(email);
        break;
      case 'patient':
        user = await this.patientService.findPatientByEmail(email);
        break;
      case 'medical_staff':
        user = await this.medicalStaffService.findMedicalStaffByEmail(email);
        break;
    }
    if (await this.hashService.comparePassword(password, user.password)) {
      return user;
    } else {
      throw new UnauthorizedException('Wrong Password');
    }
  }

  async login(user: any) {
    const payload = { email: user.email, id: user.id, type: user.type };
    const secret_key = await this.changeSecretKey(user.id, user.type);
    return {
      access_token: this.jwtService.sign(payload, { secret: secret_key }),
    };
  }

  async changeSecretKey(id: string, type: string) {
    switch (type) {
      case 'client':
        return await this.clientService.changeSecretKey(id);
      case 'patient':
        return this.patientService.changeSecretKey(id);
      case 'medical_staff':
        return this.medicalStaffService.changeSecretKey(id);
    }
  }
}
