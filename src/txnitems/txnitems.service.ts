import { Injectable } from '@nestjs/common';
import { CreateTxnitemDto } from './dto/create-txnitem.dto';
import { UpdateTxnitemDto } from './dto/update-txnitem.dto';

@Injectable()
export class TxnitemsService {
  create(createTxnitemDto: CreateTxnitemDto) {
    return 'This action adds a new txnitem';
  }

  findAll() {
    return `This action returns all txnitems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} txnitem`;
  }

  update(id: number, updateTxnitemDto: UpdateTxnitemDto) {
    return `This action updates a #${id} txnitem`;
  }

  remove(id: number) {
    return `This action removes a #${id} txnitem`;
  }
}
