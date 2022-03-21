import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const saltRounds = 10;
@Injectable()
export class HashService {
  async encodeString(password: string) {
    return bcrypt.hashSync(password, saltRounds);
  }
  async compareHash(password: string, hash: string) {
    if (!password || !hash) return false;
    return bcrypt.compareSync(password, hash);
  }
}
