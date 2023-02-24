import { Test, TestingModule } from '@nestjs/testing';
import { SitetypeService } from './sitetype.service';

describe('SitetypeService', () => {
  let service: SitetypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SitetypeService],
    }).compile();

    service = module.get<SitetypeService>(SitetypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
