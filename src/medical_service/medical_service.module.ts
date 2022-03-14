import { MedicalServiceController } from './medical_service.controller';
import { forwardRef, Module } from '@nestjs/common';
import { MedicalServiceService } from './medical_service.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicalServiceSchema } from './medical_service.model';
import { HashService } from 'src/auth/hash.service';
import { KeyGeneratorService } from 'src/auth/key-generator.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([
      { name: 'MedicalService', schema: MedicalServiceSchema },
    ]),
  ],
  controllers: [MedicalServiceController],
  providers: [MedicalServiceService],
  exports: [MedicalServiceService],
})
export class MedicalServiceModule {}
