import { PartialType } from '@nestjs/mapped-types';
import { CreateTxnDto } from './create-txn.dto';

export class UpdateTxnDto extends PartialType(CreateTxnDto) {}
