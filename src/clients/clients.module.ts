import { AuthModule } from './../auth/auth.module';
import { KeyGeneratorService } from './../auth/key-generator.service';
import { HashService } from '../auth/hash.service';
import { ClientController } from './clients.controller';
import { forwardRef, Module } from '@nestjs/common';
import { ClientService } from './clients.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientSchema } from './clients.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([{ name: 'Client', schema: ClientSchema }]),
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION },
    }),
  ],
  controllers: [ClientController],
  providers: [ClientService, HashService, KeyGeneratorService],
  exports: [ClientService],
})
export class ClientModule {}
