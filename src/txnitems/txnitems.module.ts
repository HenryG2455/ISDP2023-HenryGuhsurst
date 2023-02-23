import { Module } from '@nestjs/common';
import { TxnitemsService } from './txnitems.service';
import { TxnitemsController } from './txnitems.controller';

@Module({
  controllers: [TxnitemsController],
  providers: [TxnitemsService]
})
export class TxnitemsModule {}
