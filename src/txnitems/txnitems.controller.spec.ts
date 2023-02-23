import { Test, TestingModule } from '@nestjs/testing';
import { TxnitemsController } from './txnitems.controller';
import { TxnitemsService } from './txnitems.service';

describe('TxnitemsController', () => {
  let controller: TxnitemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TxnitemsController],
      providers: [TxnitemsService],
    }).compile();

    controller = module.get<TxnitemsController>(TxnitemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
