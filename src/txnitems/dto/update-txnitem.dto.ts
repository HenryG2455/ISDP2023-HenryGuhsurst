import { PartialType } from '@nestjs/mapped-types';
import { CreateTxnitemDto } from './create-txnitem.dto';

export class UpdateTxnitemDto extends PartialType(CreateTxnitemDto) {}
