import { Test, TestingModule } from '@nestjs/testing';
import { TxnitemsService } from './txnitems.service';

describe('TxnitemsService', () => {
  let service: TxnitemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TxnitemsService],
    }).compile();

    service = module.get<TxnitemsService>(TxnitemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
