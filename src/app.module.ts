import { MedicalServiceModule } from './medical_service/medical_service.module';
import { ClientModule } from 'src/clients/clients.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { MedicalStaffModule } from './medical_staff/medical_staff.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { RolesGuard } from './roles/roles.guard';
import { PatientModule } from './patients/patient.module';
dotenv.config();

@Module({
  imports: [
    AuthModule,
    ClientModule,
    PatientModule,
    MedicalStaffModule,
    MedicalServiceModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_CONNECTION),
  ],
  controllers: [AppController],
  providers: [RolesGuard],
})
export class AppModule {}
