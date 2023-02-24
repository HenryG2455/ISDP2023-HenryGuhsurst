import { Test, TestingModule } from '@nestjs/testing';
import { SitetypeController } from './sitetype.controller';
import { SitetypeService } from './sitetype.service';

describe('SitetypeController', () => {
  let controller: SitetypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SitetypeController],
      providers: [SitetypeService],
    }).compile();

    controller = module.get<SitetypeController>(SitetypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
