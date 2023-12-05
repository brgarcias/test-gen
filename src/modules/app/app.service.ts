import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiName(): string {
    return 'API is running! Test-Gen V1.0';
  }
}
