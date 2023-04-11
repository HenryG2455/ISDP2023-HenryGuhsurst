import { Injectable } from '@nestjs/common';
import { CreateTxnauditDto } from './dto/create-txnaudit.dto';
import { UpdateTxnauditDto } from './dto/update-txnaudit.dto';
import { PrismaService } from '../prisma/prisma.service';
import { txnitems, txn, Prisma} from "@prisma/client";

@Injectable()
export class TxnauditService {
  constructor(private prisma: PrismaService){}

  async create(info: any) {
    try {
      console.log(info);
      let {txnID, txnType, status, txnDate, SiteID, employeeID, deliveryID, notes} = info;
      txnDate = new Date(txnDate);
      const data: Prisma.txnauditCreateInput = {
        txnID,
        status,
        txnType,
        site:{
          connect:{
            siteID:+SiteID
          },
        },
        employee:{
          connect:{
            employeeID:+employeeID
            },
        },
        deliveryID,
        notes,
      }
      
      const txnaudit  = await this.prisma.txnaudit.create({ data: data }) // Get the txnID of the newly created row
      console.log("RAN")
      return txnaudit;
    } catch (error) {
      console.log(error)
      return error;
    }
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
