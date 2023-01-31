import { Test, TestingModule } from '@nestjs/testing';
import { PosnController } from './posn.controller';
import { PosnService } from './posn.service';

describe('PosnController', () => {
  let controller: PosnController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PosnController],
      providers: [PosnService],
    }).compile();

    controller = module.get<PosnController>(PosnController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
