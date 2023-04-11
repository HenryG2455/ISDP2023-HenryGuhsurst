import { Injectable } from '@nestjs/common';
import { CreateTxnDto } from './dto/create-txn.dto';
import { UpdateTxnDto } from './dto/update-txn.dto';
import { txnitems, txn, Prisma} from "@prisma/client";
import { PrismaService } from '../prisma/prisma.service';
import { CreateTxnitemDto } from 'src/txnitems/dto/create-txnitem.dto';
import {constants,txnTypes,txnStatus} from '../data/Constants.js';



@Injectable()
export class TxnService {
  constructor(private prisma: PrismaService){}
  

  async create(createTxnDto: CreateTxnDto, createTxnItems: CreateTxnitemDto[], user: any) {
    // console.log(createTxnDto)
    // console.log(createTxnItems)
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
      delivery:undefined,
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
              status: {
                in: ['CLOSED','CANCELLED']
              }
            }
          } 
        },
        include:{
          site_txn_siteIDFromTosite:true,
          site_txn_siteIDToTosite:true,
          delivery:true,
          txnitems:{
            include:{
              item: {
                include:{
                  supplier: true,
                },
              },
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
            in: ['Back Order','Store Order']
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



  async updateSuppOrder(txn: any, txnItems: any, removedItems: any, user: any) {
    let {siteIDTo, siteIDFrom, status, shipDate, txnType, barCode, createdDate, emergencyDelivery} = txn
    shipDate = new Date(shipDate);
    createdDate= new Date(createdDate);

    const txnItemsRemove = removedItems.map((dto) => ({
      // Map the DTO fields to the Prisma fields
      ItemID: dto.ItemID,
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
    const txnUpdate = await this.prisma.txn.update({
      where: {
        txnID: txn.txnID,
      },
      data
    })
    for (const txnItem of txnItems) {
      await this.prisma.txnitems.upsert({
        where: {
          txnID_ItemID: {
            txnID: txnItem.txnID,
            ItemID: txnItem.ItemID,
          },
        },
        update: {}, // Do nothing if the record already exists
        create: {
          quantity: txnItem.quantity,
          txn: {
            connect: {
              txnID: txnItem.txnID,
            },
          },
          item: {
            connect: {
              itemID: txnItem.ItemID,
            }
          }
        },
      });
    }
    if(removedItems.length > 0){
      await this.prisma.txnitems.deleteMany({
        where: {
          OR: txnItemsRemove,
        },
      });
    }
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


  //REPORTS
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  async deliveryReport(info:any) {
    console.log(info)
    if(info.endDate === null){
      const startDate = new Date(info.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1);
      const txn = await this.prisma.txn.findMany({
        where: {
          shipDate:{
            gte: info.startDate,
            lte: endDate,
          },
          txnType: {
            in: ['Back Order','Store Order']
          },
          status: {
            in: [txnStatus.READY, txnStatus.IN_TRANSIT, txnStatus.DELIVERED, txnStatus.CLOSED,]
          }
        },
      })
      return txn;
    }else{
      const txn = await this.prisma.txn.findMany({
        where: {
          shipDate: {
            gte: info.startDate,
            lte: info.endDate,
          },
          txnType: {
            in: ['Back Order', 'Store Order'],
          },
          status: {
            in: [
              txnStatus.READY,
              txnStatus.IN_TRANSIT,
              txnStatus.DELIVERED,
              txnStatus.CLOSED,
            ],
          },
        },
        include:{
          delivery: true,
          site_txn_siteIDToTosite: true,
          site_txn_siteIDFromTosite: true,
        }
      });
      const formattedData = txn.map((delivery) => {
        return {
          deliveryID: delivery.deliveryID,
          status: delivery.status,
          shipDate: delivery.shipDate,
          route: "Pickup Address: "+delivery.site_txn_siteIDFromTosite.address+", DeliveryAddress: "+delivery.site_txn_siteIDToTosite.address, // Assuming the route model has a 'name' field
          mileage: delivery.site_txn_siteIDToTosite.distanceFromWH+'km.', // Assuming the route model has a 'mileage' field
        };
      });
      return formattedData;
    }
  }

  async storeOrdersReport(info:any) {
    console.log(info)
    if(info.location === 'all'){
      const txn = await this.prisma.txn.findMany({
        where: {
          txnType: {
            in: ['Store Order']
          },
        },
        include:{
          txnitems: {
            include: {
              item: true,
            },
          },
          delivery: true,
          site_txn_siteIDToTosite: true,
          site_txn_siteIDFromTosite: true,
        }
      })
      const formattedData = txn.map((order) => {
        return {
          deliveryID: order.deliveryID,
          status: order.status,
          shipDate: new Date(order.shipDate).toISOString().split('T')[0],
          createdDate: new Date(order.createdDate).toISOString().split('T')[0],
          To: order.site_txn_siteIDToTosite.name,
          From: order.site_txn_siteIDFromTosite.name,
          txnID: order.txnID,
          emergency: order.emergencyDelivery? 'Yes': 'No',
          price: order.txnitems.reduce((a, b) => a + (+b.item.costPrice * b.quantity), 0),
          items: order.txnitems.map((item) => { 
            return item.ItemID+','+item.item.name+','+item.quantity
          }),

        };
      });
      return formattedData;
    }else{
      const txn = await this.prisma.txn.findMany({
        where: {
          txnType: {
            in: ['Store Order'],
          },
          OR: [
            {
              siteIDTo:+info.location,
            },
            {
              siteIDFrom:+info.location,
            }
          ]

        },
        include:{
          txnitems: {
            include: {
              item: true,
            },
          },
          delivery: true,
          site_txn_siteIDToTosite: true,
          site_txn_siteIDFromTosite: true,
        }
      });
      const formattedData = txn.map((order) => {
        return {
          deliveryID: order.deliveryID,
          status: order.status,
          shipDate: new Date(order.shipDate).toISOString().split('T')[0],
          createdDate: new Date(order.createdDate).toISOString().split('T')[0],
          To: order.site_txn_siteIDToTosite.name,
          From: order.site_txn_siteIDFromTosite.name,
          txnID: order.txnID,
          emergency: order.emergencyDelivery? 'Yes': 'No',
          price: order.txnitems.reduce((a, b) => a + (+b.item.costPrice * b.quantity), 0),
          items: order.txnitems.map((item) => { 
            return item.ItemID+','+item.item.name+','+item.quantity
          }),
        };
      });
      return formattedData;
    }
  }


  async shippingReport(info:any) {
    console.log(info)
    if(info.location === 'all'){
      const txn = await this.prisma.txn.findMany({
        where: {
          txnType: {
            in: ['Store Order']
          },
          deliveryID: {
            not: null
          },
        },
        include:{
          txnitems:{
            include:{
              item: true,
            }
          },
          delivery: true,
          site_txn_siteIDToTosite: true,
          site_txn_siteIDFromTosite: true,
        }
      })
      console.log(txn)
      const formattedData = txn.map((order) => {
        return {
          deliveryID: order.deliveryID,
          status: order.status,
          shipDate: new Date(order.shipDate).toISOString().split('T')[0],
          To: order.site_txn_siteIDToTosite.name,
          From: order.site_txn_siteIDFromTosite.name,
          mileage: order.site_txn_siteIDToTosite.distanceFromWH+'km.',
          items: order.txnitems.map((item) => { 
            return item.ItemID+','+item.item.name+','+item.quantity
          }),
        };
      });
      return formattedData;
    }else{
      const txn = await this.prisma.txn.findMany({
        where: {
          txnType: {
            in: ['Store Order'],
          },
          deliveryID: {
            not: null
          },
          OR: [
            {
              siteIDTo:+info.location,
            },
            {
              siteIDFrom:+info.location,
            }
          ]

        },
        include:{
          txnitems:{
            include:{
              item: true,
            }
          },
          delivery: true,
          site_txn_siteIDToTosite: true,
          site_txn_siteIDFromTosite: true,
        }
      });
      const formattedData = txn.map((order) => {
        return {
          deliveryID: order.deliveryID,
          status: order.status,
          shipDate: new Date(order.shipDate).toISOString().split('T')[0],
          To: order.site_txn_siteIDToTosite.name,
          From: order.site_txn_siteIDFromTosite.name,
          mileage: order.site_txn_siteIDToTosite.distanceFromWH+'km.',
          items: order.txnitems.map((item) => { 
            return item.ItemID+','+item.item.name+','+item.quantity
          }),
        };
      });
      return formattedData;
    }
  }

  async ordersReport(info:any) {
    try {
      if(info.location === 'all'){
        const txn = await this.prisma.txn.findMany({
          where: {
            shipDate: {
              gte: info.startDate,
              lte: info.endDate,
            },
            txnType: {
              in: ['Back Order', 'Store Order', 'Supplier Order','Online','Curbside'],
            },
          },
          include:{
            txnitems:{
              include:{
                item: true,
              }
            },
            delivery: true,
            site_txn_siteIDToTosite: true,
            site_txn_siteIDFromTosite: true,
          }
        });
        const formattedData = txn.map((delivery) => {
          return {
            deliveryID: delivery.deliveryID,
            status: delivery.status,
            shipDate: new Date(delivery.shipDate).toISOString().split('T')[0],
            createdDate: new Date(delivery.createdDate).toISOString().split('T')[0],
            to: delivery.site_txn_siteIDToTosite.name,
            from: delivery.site_txn_siteIDFromTosite.name,
            emergency: delivery.emergencyDelivery? 'Yes': 'No',
            items: delivery.txnitems.map((item) => { 
              return item.ItemID+','+item.item.name+','+item.quantity
            }),
            price:"$"+ delivery.txnitems.map((item) => {
              return item.quantity*+item.item.costPrice
            }).reduce((a,b) => a+b),
          };
        });
        return formattedData;
      }else{
        const txn = await this.prisma.txn.findMany({
          where: {
            shipDate: {
              gte: info.startDate,
              lte: info.endDate,
            },
            txnType: {
              in: ['Back Order', 'Store Order', 'Supplier Order','Online','Curbside'],
            },
            OR: [
              {
                siteIDTo:+info.location,
              },
              {
                siteIDFrom:+info.location,
              }
            ]
          },
          include:{
            delivery: true,
            txnitems: {
              include: {
                item: true,
              }
            },
            site_txn_siteIDToTosite: true,
            site_txn_siteIDFromTosite: true,
          }
        });
        const formattedData = txn.map((delivery) => {
          return {
            deliveryID: delivery.deliveryID,
            status: delivery.status,
            shipDate: new Date(delivery.shipDate).toISOString().split('T')[0],
            createdDate: new Date(delivery.createdDate).toISOString().split('T')[0],
            to: delivery.site_txn_siteIDToTosite.name,
            from: delivery.site_txn_siteIDFromTosite.name,
            emergency: delivery.emergencyDelivery? 'Yes': 'No',
          };
        });
        return formattedData;
      }
    } catch (error) {
      return error;
    }
  }

  async emergencyReport(info:any) {
    try {
      if(info.location === 'all'){
        const txn = await this.prisma.txn.findMany({
          where: {
            shipDate: {
              gte: info.startDate,
              lte: info.endDate,
            },
            txnType: {
              in: ['Back Order', 'Store Order', 'Supplier Order','Online','Curbside'],
            },
            emergencyDelivery: true,
          },
          include:{
            txnitems:{
              include:{
                item: true,
              }
            },
            delivery: true,
            site_txn_siteIDToTosite: true,
            site_txn_siteIDFromTosite: true,
          }
        });
        const formattedData = txn.map((delivery) => {
          return {
            deliveryID: delivery.deliveryID,
            status: delivery.status,
            shipDate: new Date(delivery.shipDate).toISOString().split('T')[0],
            createdDate: new Date(delivery.createdDate).toISOString().split('T')[0],
            to: delivery.site_txn_siteIDToTosite.name,
            from: delivery.site_txn_siteIDFromTosite.name,
            price: delivery.txnitems.reduce((a, b) => a + (+b.item.costPrice * b.quantity), 0),
            items: delivery.txnitems.map((item) => {
              return item.ItemID+','+item.item.name+','+item.quantity
            }),
          };
        });
        return formattedData;
      }else{
        const txn = await this.prisma.txn.findMany({
          where: {
            shipDate: {
              gte: info.startDate,
              lte: info.endDate,
            },
            txnType: {
              in: ['Back Order', 'Store Order', 'Supplier Order','Online','Curbside'],
            },
            emergencyDelivery: true,
            OR: [
              {
                siteIDTo:+info.location,
              },
              {
                siteIDFrom:+info.location,
              }
            ]
          },
          include:{
            delivery: true,
            txnitems: {
              include: {
                item: true,
              }
            },
            site_txn_siteIDToTosite: true,
            site_txn_siteIDFromTosite: true,
          }
        });
        const formattedData = txn.map((delivery) => {
          return {
            deliveryID: delivery.deliveryID,
            status: delivery.status,
            shipDate: new Date(delivery.shipDate).toISOString().split('T')[0],
            createdDate: new Date(delivery.createdDate).toISOString().split('T')[0],
            to: delivery.site_txn_siteIDToTosite.name,
            from: delivery.site_txn_siteIDFromTosite.name,
            price: delivery.txnitems.reduce((a, b) => a + (+b.item.costPrice * b.quantity), 0),
            items: delivery.txnitems.map((item) => {
              return item.ItemID+','+item.item.name+','+item.quantity
            }),
          };
        });
        return formattedData;
      }
    } catch (error) {
      return error;
    }
  }



  async backOrdersReport(info:any) {
    console.log(info)
    if(info.location === 'all'){
      const txn = await this.prisma.txn.findMany({
        where: {
          txnType: {
            in: ['Back Order']
          },
        },
        include:{
          txnitems:{
            include:{
              item: true,
            }
          },
          delivery: true,
          site_txn_siteIDToTosite: true,
          site_txn_siteIDFromTosite: true,
        }
      })
      const formattedData = txn.map((order) => {
        return {
          deliveryID: order.deliveryID,
          status: order.status,
          shipDate: new Date(order.shipDate).toISOString().split('T')[0],
          createdDate: new Date(order.createdDate).toISOString().split('T')[0],
          To: order.site_txn_siteIDToTosite.name,
          From: order.site_txn_siteIDFromTosite.name,
          txnID: order.txnID,
          notes: order.notes,
          items: order.txnitems.map((item) => {
            return [
              item.ItemID+','+item.item.name+','+item.quantity
            ]
          })
        };
      });
      return formattedData;
    }else{
      const txn = await this.prisma.txn.findMany({
        where: {
          txnType: {
            in: ['Back Order'],
          },
          OR: [
            {
              siteIDTo:+info.location,
            },
            {
              siteIDFrom:+info.location,
            }
          ]

        },
        include:{
          txnitems:{
            include:{
              item: true,
            },
          },
          delivery: true,
          site_txn_siteIDToTosite: true,
          site_txn_siteIDFromTosite: true,
        }
      });
      const formattedData = txn.map((order) => {
        return {
          deliveryID: order.deliveryID,
          status: order.status,
          shipDate: new Date(order.shipDate).toISOString().split('T')[0],
          createdDate: new Date(order.createdDate).toISOString().split('T')[0],
          To: order.site_txn_siteIDToTosite.name,
          From: order.site_txn_siteIDFromTosite.name,
          txnID: order.txnID,
          notes: order.notes,
          items: order.txnitems.map((item) => {
            return [
              item.ItemID+','+item.item.name+','+item.quantity
            ]
          })
        };
      });
      return formattedData;
    }
  }

  async suppOrdersReport(info:any) {
    console.log(info)
    const txn = await this.prisma.txn.findMany({
      where: {
        txnType: {
          in: ['Supplier Order']
        },
        status:{
          not: 'CANCELLED'
        },
        createdDate: {
          gte: info.startDate,
          lte: info.endDate,
        },
      },
      include:{
        txnitems:{
          include:{
            item: {
              include:{
                supplier: true,
              },
            },
          }
        },
        delivery: true,
        site_txn_siteIDToTosite: true,
        site_txn_siteIDFromTosite: true,
      }
    })
    console.log(txn)
    const formattedData = txn.map((order) => {
      return {
        status: order.status,
        createdDate: new Date(order.createdDate).toISOString().split('T')[0],
        txnID: order.txnID,
        supplier: order.txnitems[0].item.supplier.name,
        requestedItems: order.txnitems.map((item) => {
          return [
           item.ItemID+','+item.item.name+','+item.quantity  
          ]
        })
      };
    });
    return formattedData;
  }
  

  async lossReturnReport(info:any) {
    console.log(info)
    if(info.location === 'all'){
      const txn = await this.prisma.txn.findMany({
        where: {
          txnType: {
            in: ['Loss', 'Return']
          },
        },
        include:{
          txnitems:{
            include:{
              item: true,
            }
          },
          delivery: true,
          site_txn_siteIDToTosite: true,
          site_txn_siteIDFromTosite: true,
        }
      })
      const formattedData = txn.map((order) => {
        return {
          txnType: order.txnType,
          status: order.status,
          createdDate: new Date(order.createdDate).toISOString().split('T')[0],
          where: order.site_txn_siteIDToTosite.name,
          txnID: order.txnID,
          notes: order.notes,
          items: order.txnitems.map((item) => {
            return [
              item.ItemID+','+item.item.name+','+item.quantity  
            ]
          })
        };
      });
      const sortedData = formattedData.sort((a, b) => {
        if (a.status === 'Loss' && b.status !== 'Loss') {
          return -1;
        } else if (a.status !== 'Loss' && b.status === 'Loss') {
          return 0;
        } else if (a.status === 'Return' && b.status !== 'Return') {
          return 1;
        } else if (a.status !== 'Return' && b.status === 'Return') {
          return -1;
        } else {
          return 0;
        }
      });
      
      return sortedData;
    }else{
      const txn = await this.prisma.txn.findMany({
        where: {
          txnType: {
            in: ['Loss', 'Return'],
          },
          OR: [
            {
              siteIDTo:+info.location,
            },
            {
              siteIDFrom:+info.location,
            }
          ]

        },
        include:{
          txnitems:{
            include:{
              item: true,
            },
          },
          delivery: true,
          site_txn_siteIDToTosite: true,
          site_txn_siteIDFromTosite: true,
        }
      });
      const formattedData = txn.map((order) => {
        return {
          txnType: order.txnType,
          status: order.status,
          createdDate: new Date(order.createdDate).toISOString().split('T')[0],
          where: order.site_txn_siteIDToTosite.name,
          txnID: order.txnID,
          notes: order.notes,
          items: order.txnitems.map((item) => {
            return [
              item.ItemID+','+item.item.name+','+item.quantity  
            ]
          })
        };
      });
      const sortedData = formattedData.sort((a, b) => {
        if (a.status === 'Loss' && b.status !== 'Loss') {
          return -1;
        } else if (a.status !== 'Loss' && b.status === 'Loss') {
          return 0;
        } else if (a.status === 'Return' && b.status !== 'Return') {
          return 1;
        } else if (a.status !== 'Return' && b.status === 'Return') {
          return -1;
        } else {
          return 0;
        }
      });
      
      return sortedData;
    }
  }
}


