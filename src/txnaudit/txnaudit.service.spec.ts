import { Test, TestingModule } from '@nestjs/testing';
import { TxnauditService } from './txnaudit.service';

describe('TxnauditService', () => {
  let service: TxnauditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TxnauditService],
    }).compile();

    service = module.get<TxnauditService>(TxnauditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
