import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    appService = module.get<AppService>(AppService);
  });

  describe('getApiName', () => {
    it('should return the API name', () => {
      const apiName = appService.getApiName();

      expect(apiName).toBe('API is running! Test-Gen V1.0');
    });
  });
});
