import { Module } from '@nestjs/common';
import { PosnService } from './posn.service';
import { PosnController } from './posn.controller';

@Module({
  controllers: [PosnController],
  providers: [PosnService]
})
export class PosnModule {}
