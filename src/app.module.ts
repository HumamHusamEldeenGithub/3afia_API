import { ClientModule } from 'src/clients/clients.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PatientModule } from './patients/patient.module';
import { MedicalStaffModule } from './medical_staff/medical_staff.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ClientModule,
    PatientModule,
    MedicalStaffModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_CONNECTION+''),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
