import { PartialType } from '@nestjs/mapped-types';
import { CreateTxnauditDto } from './create-txnaudit.dto';

export class UpdateTxnauditDto extends PartialType(CreateTxnauditDto) {}
