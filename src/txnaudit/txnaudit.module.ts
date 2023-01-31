import { Module } from '@nestjs/common';
import { TxnauditService } from './txnaudit.service';
import { TxnauditController } from './txnaudit.controller';

@Module({
  controllers: [TxnauditController],
  providers: [TxnauditService]
})
export class TxnauditModule {}
