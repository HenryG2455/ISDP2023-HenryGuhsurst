import { Injectable } from '@nestjs/common';
import { CreateTxnDto } from './dto/create-txn.dto';
import { UpdateTxnDto } from './dto/update-txn.dto';
import { txnitems, txn, Prisma} from "@prisma/client";
import { PrismaService } from '../prisma/prisma.service';
import { CreateTxnitemDto } from 'src/txnitems/dto/create-txnitem.dto';
import Enumerable from 'linq';
import {constants,txnTypes,txnStatus} from '../data/Constants.js';
import { Inventory } from 'src/inventory/entities/inventory.entity';


@Injectable()
export class TxnService {
  constructor(private prisma: PrismaService){}
  

  async create(createTxnDto: CreateTxnDto, createTxnItems: CreateTxnitemDto[]) {
    console.log(createTxnDto)
    console.log(createTxnItems)
    // Add the txnItems object to the txnItems table
    const txnItems = createTxnItems.map((dto) => ({
      // Map the DTO fields to the Prisma fields
      ItemID: dto.ItemID,
      quantity: dto.quantity,
    })) as Prisma.txnitemsCreateManyTxnInput[];
    //const txnItemsEnumerable = Enumerable.from(txnItems);
    let {siteIDTo, siteIDFrom, status, shipDate, txnType, barCode, createdDate, deliveryID, emergencyDelivery, notes} = createTxnDto
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

      //delivery:{
      //  connect: {
      //    deliveryID: deliveryID
      //  },
      //},
      emergencyDelivery,
      txnitems:{
        createMany:{
          data:txnItems
        }
      },
      notes,
    }
    const createdTxn  = await this.prisma.txn.create({ data: data }) // Get the txnID of the newly created row
    return {createdTxn}
  }


  async createLR(txn: any , txnItems: any, user: any) {
    //console.log(txn.txn)
    //console.log(txnItems.txnItems)
    // Add the txnItems object to the txnItems table
    const newTxnItems = txnItems.txnItems.map((dto) => ({
      // Map the DTO fields to the Prisma fields
      ItemID: dto.ItemID,
      quantity: dto.quantity,
    })) as Prisma.txnitemsCreateManyTxnInput[];
    //const txnItemsEnumerable = Enumerable.from(txnItems);
    let {siteIDTo, siteIDFrom, status, shipDate, txnType, barCode, createdDate, deliveryID, emergencyDelivery, notes} = txn.txn
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
         deliveryID: 1
       },
      },
      emergencyDelivery,
      txnitems:{
        createMany:{
          data:newTxnItems
        }
      },
      notes,
    }
    let res;

    if(txnType == "LOSS"){
      txnItems.txnItems.forEach(async (item) => {
        let itemID = item.ItemID;
        let siteID = user.user.siteID;
        const invItem = await this.prisma.inventory.findUnique({
          where: { itemID_siteID: { itemID, siteID } },
        });
        let quantity = invItem.quantity - item.quantity;
        const where = { itemID,siteID };
        res = await this.prisma.inventory.update({
          where:{ itemID_siteID: where},
          data: { quantity},
        });
        console.log(res)
      })
    }else if(txnType =="RETURN"){
      txnItems.txnItems.forEach(async (item) => {
        let itemID = item.ItemID;
        let siteID=user.user.siteID;
        const invItem = await this.prisma.inventory.findUnique({
          where: { itemID_siteID: { itemID, siteID } },
        });
        let quantity = invItem.quantity + item.quantity;
        const where = { itemID,siteID };
        res = await this.prisma.inventory.update({
          where:{ itemID_siteID: where},
          data: { quantity},
        });
        console.log(res)
      });
    }  
    //console.log(res)
    const createdTxn  = await this.prisma.txn.create({ data: data })
     // Get the txnID of the newly created row
    return {createdTxn}
  }


  async findAll() {
    try {
      const txns = await this.prisma.txn.findMany({
        where: {
          AND: [
            { txnType: { in: ['Curbside', 'Back Order','Store Order','Supplier Order','Online'] } },
            { status: { in: ['NEW','SUBMITTED','RECEIVED','PROCESSING'] } }
          ],
        },
      });
      return txns;
    } catch (error) {
      console.error(error);
    }
  }

  async findAllCustOrders(email:string, txnID:number) {
    try {
      const txns = await this.prisma.txn.findMany({
        where: {
          AND: [
            { txnID: +txnID },
            { notes: { endsWith: email.toLowerCase() } }
          ]
        }
      });
      return txns;
    } catch (error) {
      console.error(error);
    }
  }


  async findAllOnlineOrders(id: number) {
    try {
      const onlineOrders = await this.prisma.txn.findMany({
        where: {
          AND: [
            { siteIDTo: id },
            { txnType: 'Curbside' },
            { status: 'PROCESSING' },
          ],
        },
        include:{
          site_txn_siteIDFromTosite:true,
          site_txn_siteIDToTosite:true,
          delivery:true,
          txnitems:{
            include:{
              item:true,
            }
          },
      }});
      return onlineOrders;
    } catch (error) {
      console.error(error);
    }
  }

  async findAllCurbsideReady(id: number) {
    try {
      const onlineOrders = await this.prisma.txn.findMany({
        where: {
          AND: [
            { siteIDTo: id },
            { txnType: 'Curbside' },
            { status: 'READY' },
          ],
        },
        include:{
          site_txn_siteIDToTosite:true,
          txnitems:{
            include:{
              item:true,
            }
          },
      }});
      return onlineOrders;
    } catch (error) {
      console.error(error);
    }
  }


  async findAllOrders() {
    try {
      const orders = await this.prisma.txn.findMany({
        where: {
          txnType: {
            in: ['Back Order','Store Order','Supplier Order']
          },
          AND: {
            NOT: {
              status: "CLOSED"
            }
          } 
        },
        include:{
          site_txn_siteIDFromTosite:true,
          site_txn_siteIDToTosite:true,
          delivery:true,
          txnitems:{
            include:{
              item:true,
            }
          },
        }
      });
      return orders
    } catch (error) {
      console.error(error);
    }
  } 

  async findAllReadyOrders() {
    try {
      const orders = await this.prisma.txn.findMany({
        where: {
          txnType: {
            in: ['Back Order','Store Order','Supplier Order']
          },
          status: {
            in: [txnStatus.READY, txnStatus.IN_TRANSIT]
          }
        },
        include:{
          site_txn_siteIDFromTosite:true,
          site_txn_siteIDToTosite:true,
          delivery:true,
          txnitems:{
            include:{
              item:true,
            }
          },
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
  

  async updateStoreOrder(id: number, updateTxnDto: UpdateTxnDto, removedItems: any) {
    let {siteIDTo, siteIDFrom, status, shipDate, txnType, barCode, createdDate, deliveryID, emergencyDelivery} = updateTxnDto
    shipDate = new Date(shipDate);
    createdDate= new Date(createdDate);
    const txnItems = removedItems.map((dto) => ({
      // Map the DTO fields to the Prisma fields
      ItemID: dto.itemID,
      quantity: dto.quantity,
    })) as Prisma.txnitemsCreateManyTxnInput[];
    const data:Prisma.txnUpdateInput = {
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
      emergencyDelivery,
    }
    const txn = await this.prisma.txn.update({
      where: {
        txnID: id,
      },
      data
    })
    await this.prisma.txnitems.deleteMany({
      where: {
        OR: removedItems,
      },
    });
    return txn;

  }

  async closeStoreOrder(id: number) {
    const data:Prisma.txnUpdateInput = {
      txnstatus:{
        connect: {
					statusName: txnStatus.CLOSED
				},
      },
    }
    const txn = await this.prisma.txn.update({
      where: {
        txnID: id,
      },
      data
    })
    return txn;
  }


  async cancelTxn(id: number) {
    const data:Prisma.txnUpdateInput = {
      txnstatus:{
        connect: {
					statusName: txnStatus.CANCELLED
				},
      },
    }
    const txn = await this.prisma.txn.update({
      where: {
        txnID: id,
      },
      data
    })
    return txn;
  }
  
  async porcessOrder(id: number) {
    const data:Prisma.txnUpdateInput = {
      txnstatus:{
        connect: {
					statusName: txnStatus.PROCESSING
				},
      },
    }
    const txn = await this.prisma.txn.update({
      where: {
        txnID: id,
      },
      data
    })
    return txn;
  }

  async deliverOrder(id: number) {
    const data:Prisma.txnUpdateInput = {
      txnstatus:{
        connect: {
					statusName: txnStatus.DELIVERED
				},
      },
    }
    const txn = await this.prisma.txn.update({
      where: {
        txnID: id,
      },
      data
    })
    return txn;
  }

  async closeOrder(id: number) {
    const data:Prisma.txnUpdateInput = {
      txnstatus:{
        connect: {
					statusName: txnStatus.CLOSED
				},
      },
    }
    const txn = await this.prisma.txn.update({
      where: {
        txnID: id,
      },
      data
    })
    return txn;
  }

  async transitOrder(id: number , deliveryID: number) {
    const data:Prisma.txnUpdateInput = {
      txnstatus:{
        connect: {
					statusName: txnStatus.IN_TRANSIT
				},
      },
      delivery:{
       connect: {
         deliveryID: deliveryID
       },
      },
    }
    const txn = await this.prisma.txn.update({
      where: {
        txnID: id,
      },
      data
    })
    return txn;
  }


  async updateBackOrder(id: number, txn :any, txnitems:any) {
    const data:Prisma.txnUpdateInput = {
      txnstatus:{
        connect: {
					statusName: txnStatus.PROCESSING
				},
      },
    }
    const temptxn = await this.prisma.txn.update({
      where: {
        txnID: id,
      },
      data
    })
    return txn;
  }



  async readyOrder(id: number,  updateTxnDto: UpdateTxnDto) {
    let {siteIDTo, siteIDFrom, status, shipDate, txnType, barCode, createdDate, deliveryID, emergencyDelivery, notes} = updateTxnDto
    shipDate = new Date(shipDate);
    createdDate= new Date(createdDate);
    const data:Prisma.txnUpdateInput = {
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
        connect:{

        }
      },
      notes
    }
    const txn = await this.prisma.txn.update({
      where: {
        txnID: id,
      },
      data
    })
    return txn;
  }

  
}
