import { Injectable } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { employee, Prisma } from "@prisma/client";
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService){}
  create(createInventoryDto: CreateInventoryDto) {
    return 'This action adds a new inventory';
  }

  async findAllCustomer() {
    try {
      const items = await this.prisma.inventory.findMany({
        include:{
          item: true,
          site: true
        }
      });
      return items;
    } catch (error) {
      console.error(error);
    }
  }

  async findAll() {
    try {
      const items = await this.prisma.inventory.findMany({
        include:{
          item: true,
          site: true
        }
      });
      return items;
    } catch (error) {
      console.error(error);
    }
  }


  async findStoreInv(id: number) {
    try {
      const items = await this.prisma.inventory.findMany({
        where:{
          siteID: id
        }
      });
      return items;
    } catch (error) {
      console.error(error);
    }
  }


  async moveFromTruckToStore(id: number, txnitems:any[] ) {
    const itemIdsAndSiteIds = txnitems.map(item => ({ itemID: item.ItemID, siteID: 9999 }));
    const deletedItems = await this.prisma.inventory.deleteMany({
      where: {
        OR: itemIdsAndSiteIds.map(id => ({ itemID:id.itemID, siteID: id.siteID })),
      }
    });
    let res = this.addToStoreInv(id,txnitems);
    return deletedItems;
  }

  async addToStoreInv(id: number, txnitems: any[]){
    let res;
    console.log(txnitems)
    txnitems.forEach(async item => {
      const exists = await this.prisma.inventory.findUnique({
        where: {
          itemID_siteID: {
            itemID: item.item.itemID,
            siteID: id,
          },
        },
      });
      if (exists === null) {
        const newItem = await this.prisma.inventory.create({
          data: {
            itemID: item.item.itemID,
            siteID: id,
            quantity: item.quantity,
            itemLocation: "Pallet",
            reorderThreshold: 0
          },
        });
        res = newItem;
      } else {
        const updatedItem = await this.prisma.inventory.update({
          where: {
            itemID_siteID: {
              itemID:item.item.itemID,
              siteID: id,
            },
          },
          data: {
            quantity: { increment: item.quantity }
          },
        });
        res = updatedItem;
      }
    });
    return res;
  }



  async updateMany(id: number, updateInventoryDto:any,createInventoryDto:CreateInventoryDto[] ) {
    const itemIdsAndSiteIds = updateInventoryDto.map(item => ({ itemID: item.itemID, siteID: item.siteID }));
    const updatedInventoryItems = await this.prisma.inventory.updateMany({
      where: {
        OR: itemIdsAndSiteIds.map(id => ({ itemID:id.itemID, siteID: id.siteID })),
      },
      data: {
        itemLocation: { set: updateInventoryDto.map(item => ({ itemID: item.itemID, siteID: item.siteID, itemLocation:item.itemLocation })).find(item => item).itemLocation },
        quantity: { set: updateInventoryDto.map(item => ({ itemID: item.itemID, siteID: item.siteID, quantity: item.quantity})).find(item => item).quantity },
        reorderThreshold: { set: updateInventoryDto.map(item => ({ itemID: item.itemID, siteID: item.siteID, reorderThreshold:item.reorderThreshold})).find(item => item).reorderThreshold },
      }
    });
    if(createInventoryDto!=undefined){
      this.Rubbish(id,createInventoryDto);
    }
    return updatedInventoryItems;
  }

  async updateManyTransit(id: number, items:any[] ) {
    const itemIdsAndSiteIds = items.map(item => ({ itemID: item.ItemID, siteID: 2 }));
    const originalItems = await this.prisma.inventory.findMany({
      where: {
        OR: itemIdsAndSiteIds.map(id => ({ itemID:id.itemID, siteID: 2})),
      }
    });

    console.log(itemIdsAndSiteIds);
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log(originalItems);
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

    const deletedItems = await this.prisma.inventory.deleteMany({
      where: {
        OR: itemIdsAndSiteIds.map(id => ({ itemID:id.itemID, siteID: id.siteID })),
      }
    });
    let res = this.makeTruckInventory(id,items);
    return res;
  }

  async makeTruckInventory(id: number, items: any[]){
    let res;
    items.forEach(async itemLocation => {
      const newItem = await this.prisma.inventory.create({
        data: {
          itemID: itemLocation.ItemID,
          siteID: 9999,
          quantity: itemLocation.quantity,
          itemLocation: "Pallet",
          reorderThreshold: 0
        },
      });
      res = newItem;
    });
    return res;
  }





  async createManyInWarehouseBay(id: number, createInventoryDto: CreateInventoryDto[]){
    
    const updatedInventoryItems = await this.prisma.inventory.createMany({
      data: createInventoryDto.map(itemLocation => ({
        itemID: itemLocation.itemID,
        siteID: 2,
        quantity: itemLocation.quantity,
        itemLocation: "Pallet",
        reorderThreshold: 5
      }))
    });
    return updatedInventoryItems;
  }

  async Rubbish(id: number, createInventoryDto: CreateInventoryDto[]){
    let res;
    createInventoryDto.forEach(async itemLocation => {
      const item = await this.prisma.inventory.findUnique({
        where: {
          itemID_siteID: {
            itemID: itemLocation.itemID,
            siteID: 2,
          },
        },
      });
      if (item === null) {
        const newItem = await this.prisma.inventory.create({
          data: {
            itemID: itemLocation.itemID,
            siteID: 2,
            quantity: itemLocation.quantity,
            itemLocation: "Pallet",
            reorderThreshold: 0
          },
        });
        res = newItem;
      } else {
        const updatedItem = await this.prisma.inventory.update({
          where: {
            itemID_siteID: {
              itemID:itemLocation.itemID,
              siteID: 2,
            },
          },
          data: {
            quantity: { increment: itemLocation.quantity }
          },
        });
        res = updatedItem;
      }
    });
    return res;
  }

  //createMany(createInventoryDto: CreateInventoryDto[]) {

  async updateOne(siteID: number, data: any) {
    const updatedItem = await this.prisma.inventory.update({
      where: {  itemID_siteID: {itemID: data.itemID, siteID: siteID } },
      data,
    });
    return updatedItem;
  }
  

  remove(id: number) {
    return `This action removes a #${id} inventory`;
  }
}
