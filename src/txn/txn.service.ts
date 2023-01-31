import { Injectable } from '@nestjs/common';
import { CreateTxnDto } from './dto/create-txn.dto';
import { UpdateTxnDto } from './dto/update-txn.dto';

@Injectable()
export class TxnService {
  create(createTxnDto: CreateTxnDto) {
    return 'This action adds a new txn';
  }

  findAll() {
    return `This action returns all txn`;
  }

  findOne(id: number) {
    return `This action returns a #${id} txn`;
  }

  update(id: number, updateTxnDto: UpdateTxnDto) {
    return `This action updates a #${id} txn`;
  }

  remove(id: number) {
    return `This action removes a #${id} txn`;
  }
}
