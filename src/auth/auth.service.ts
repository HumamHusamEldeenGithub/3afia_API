import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientService } from '../clients/clients.service';
import { MedicalStaffService } from 'src/medical_staff/medical_staff.service';
import { PatientService } from 'src/patients/patient.service';
import { HashService } from './hash.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly clientService: ClientService,
    private readonly patientService: PatientService,
    private readonly medicalStaffService: MedicalStaffService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(id: string, password: string, type: string) {
    let user;
    switch (type) {
      case 'client':
        user = await this.clientService.findClient(id);
        break;
      case 'patient':
        user = await this.patientService.findPatient(id);
        break;
      case 'medical_staff':
        user = await this.medicalStaffService.findMedicalStaff(id);
        break;
    }
    if (await this.hashService.comparePassword(password, user.password)) {
      return user;
    } else {
      throw new UnauthorizedException('Wrong Password');
    }
  }

  async login(user: any) {
    const payload = { name: user.name, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
