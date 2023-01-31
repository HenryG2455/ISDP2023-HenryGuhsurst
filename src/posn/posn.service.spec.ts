import { Test, TestingModule } from '@nestjs/testing';
import { PosnService } from './posn.service';

describe('PosnService', () => {
  let service: PosnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PosnService],
    }).compile();

    service = module.get<PosnService>(PosnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
