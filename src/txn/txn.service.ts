import { Injectable } from '@nestjs/common';
import { CreateTxnDto } from './dto/create-txn.dto';
import { UpdateTxnDto } from './dto/update-txn.dto';
import { txnitems, txn, Prisma} from "@prisma/client";
import { PrismaService } from '../prisma/prisma.service';
import { CreateTxnitemDto } from 'src/txnitems/dto/create-txnitem.dto';
import Enumerable from 'linq';


@Injectable()
export class TxnService {
  constructor(private prisma: PrismaService){}
  

  async create(createTxnDto: CreateTxnDto, createTxnItems: CreateTxnitemDto[]) {
    console.log(createTxnDto)
    console.log(createTxnItems)
    // Add the txnItems object to the txnItems table
    //const tempData = Enumerable.from(createTxnItems) as Enumerable<Prisma.txnitemsCreateManyTxnInput>;
    const txnItems = createTxnItems.map((dto) => ({
      // Map the DTO fields to the Prisma fields
      ItemID: dto.itemID,
      quantity: dto.quantity,
    })) as Prisma.txnitemsCreateManyTxnInput[];
    //const txnItemsEnumerable = Enumerable.from(txnItems);
    let {siteIDTo, siteIDFrom, status, shipDate, txnType, barCode, createdDate, deliveryID, emergencyDelivery} = createTxnDto
    shipDate = new Date(shipDate);
    createdDate= new Date(createdDate);
    const data:Prisma.txnCreateInput = {
      site_txn_siteIDToTosite: {
				connect: {
          siteID: siteIDTo
				},
			},
      site_txn_siteIDFromTosite:{
				connect: {
					siteID: siteIDFrom
				},
			},
      txnstatus:{
        connect: {
					statusName: status
				},
      },
      shipDate,
      txntype:{
        connect: {
          txnType: txnType
        },
      },
      barCode,
      createdDate,
      delivery:{
        connect: {
          deliveryID: deliveryID
        },
      },
      emergencyDelivery,
      txnitems:{
        createMany:{
          data:txnItems
        }
      },
    }
    const createdTxn  = await this.prisma.txn.create({ data: data })
    const txnID = createdTxn.txnID // Get the txnID of the newly created row
    return {createdTxn}
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
