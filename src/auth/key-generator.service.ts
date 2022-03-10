import { Injectable } from '@nestjs/common';
import * as keyGen from 'keygenerator';

@Injectable()
export class KeyGeneratorService {
  /*
   * Default configuration
   *
   * chars: true
   * sticks: false
   * numbers: true
   * specials: false
   * sticks: false
   * length: 8
   * forceUppercase: false
   * forceLowercase: false
   * exclude:[ ]
   *
   */
  async generate() {
    return keyGen._();
  }
}
