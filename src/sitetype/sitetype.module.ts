import { Module } from '@nestjs/common';
import { SitetypeService } from './sitetype.service';
import { SitetypeController } from './sitetype.controller';

@Module({
  controllers: [SitetypeController],
  providers: [SitetypeService]
})
export class SitetypeModule {}
