import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  attempt(): string {
    return 'Authentication attempt successful';
  }
}
