import { HashService } from '../auth/hash.service';
import { ClientController } from './clients.controller';
import { Module } from '@nestjs/common';
import { ClientService } from './clients.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientSchema } from './clients.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Client', schema: ClientSchema }]),
  ],
  controllers: [ClientController],
  providers: [ClientService, HashService],
  exports: [ClientService],
})
export class ClientModule {}
