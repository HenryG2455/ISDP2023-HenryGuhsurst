import { Injectable } from '@nestjs/common';
import { CreateTxnDto } from './dto/create-txn.dto';
import { UpdateTxnDto } from './dto/update-txn.dto';
import { employee, Prisma } from "@prisma/client";
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TxnService {
  constructor(private prisma: PrismaService){}
  create(createTxnDto: CreateTxnDto) {
    return 'This action adds a new txn';
  }

  findAll() {
    return `This action returns all txn`;
  }
  async findAllOrders() {
    try {
      const orders = await this.prisma.txn.findMany({
        where: {
          txnType: 'Store Order'   
        },
        include:{
          site_txn_siteIDFromTosite:true,
          site_txn_siteIDToTosite:true,
          delivery:true,
          txnitems:true,
        }
      });
      return orders
    } catch (error) {
      console.error(error);
    }
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
