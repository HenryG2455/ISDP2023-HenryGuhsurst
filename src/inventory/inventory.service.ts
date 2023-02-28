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

  async findAll() {
    try {
      const items = await this.prisma.inventory.findMany();
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

  async updateMany(id: number, updateInventoryDto:any) {
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
    return updatedInventoryItems;
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
