import { Test, TestingModule } from '@nestjs/testing';
import { TxnauditController } from './txnaudit.controller';
import { TxnauditService } from './txnaudit.service';

describe('TxnauditController', () => {
  let controller: TxnauditController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TxnauditController],
      providers: [TxnauditService],
    }).compile();

    controller = module.get<TxnauditController>(TxnauditController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
