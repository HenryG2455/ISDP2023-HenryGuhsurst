import { Module } from '@nestjs/common';
import { TxnService } from './txn.service';
import { TxnController } from './txn.controller';

@Module({
  controllers: [TxnController],
  providers: [TxnService]
})
export class TxnModule {}
