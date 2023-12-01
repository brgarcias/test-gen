import { Injectable } from '@nestjs/common';
import open from 'open';

@Injectable()
export class AppService {
  async openSwagger(): Promise<void> {
    const url = 'http://localhost:3001/docs';

    await open(url);
  }

  getApiName(): string {
    return 'API is running! Test-Gen V1.0';
  }
}
