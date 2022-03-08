import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const saltRounds = 10;
@Injectable()
export class HashService {
  async encodePassword(password: string) {
    return bcrypt.hashSync(password, saltRounds);
  }
  async comparePassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }
}
