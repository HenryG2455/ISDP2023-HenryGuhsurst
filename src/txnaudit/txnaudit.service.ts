import { Injectable } from '@nestjs/common';
import { CreateTxnauditDto } from './dto/create-txnaudit.dto';
import { UpdateTxnauditDto } from './dto/update-txnaudit.dto';

@Injectable()
export class TxnauditService {
  create(createTxnauditDto: CreateTxnauditDto) {
    return 'This action adds a new txnaudit';
  }

  findAll() {
    return `This action returns all txnaudit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} txnaudit`;
  }

  update(id: number, updateTxnauditDto: UpdateTxnauditDto) {
    return `This action updates a #${id} txnaudit`;
  }

  remove(id: number) {
    return `This action removes a #${id} txnaudit`;
  }
}
