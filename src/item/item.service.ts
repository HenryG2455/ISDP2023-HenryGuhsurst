import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { employee, Prisma } from "@prisma/client";
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService){}
  async create(tempItem: any, user: any) {
    try{
      let {name, sku, description, category, weight, costPrice, retailPrice, supplierID, active, notes, caseSize} = tempItem.tempItem
      const data: Prisma.itemCreateInput = {
        name,
        sku, 
        description,
        category_item_categoryTocategory: {
          connect: {
            categoryName: category
          }
        },
        weight,
        costPrice,
        retailPrice,
        supplier: {
          connect: {
            supplierID: supplierID
          }
        },
        active,
        notes,
        caseSize,
      }
      const item = await this.prisma.item.create({
        data:data
      });
      const newWInv = await this.prisma.inventory.create({
        data:{
          itemID : item.itemID,
          siteID : 1,
          quantity : 25,
          itemLocation : "Shelf",
          reorderThreshold:25,
        }
      });
      for(let i = 4; i < 11; i++){
        const newSInv = await this.prisma.inventory.create({
          data:{
            itemID : item.itemID,
            siteID : i,
            quantity : 0,
            itemLocation : "Shelf",
            reorderThreshold:5,
          }
        });
      }
      
      return item;
    }catch(error){
      console.error(error);
    }
  }

  async findAll() {
    try {
      const items = await this.prisma.item.findMany();
      return items;
    } catch (error) {
      console.error(error);
    }
    
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }
  
  async findMany(ids: number[]) {
    try {
      const items = await this.prisma.item.findMany({
        where:{
          itemID:{
            in: ids
          }
        }
      });
      return items;
    } catch (error) {
      console.error(error);
    }
  }

  async findCount() {
    try {
      const count = await this.prisma.item.count();
      return count
    } catch (error) {
      console.error(error);
    }
  }

  async deactivate(itemID:number) {
    try {
      const count = await this.prisma.item.update({
        where:{
          itemID:itemID
        },
        data:{
          active:false
        }
      });
      return count
    } catch (error) {
      console.error(error);
    }
  }


  async update(item: any, user: any) {
    try {
      console.log(item)
      let {name, sku, description, category, weight, costPrice, retailPrice, supplierID, active, notes, caseSize} = item.item
      const data: Prisma.itemUpdateInput = {
        name,
        sku, 
        description,
        category_item_categoryTocategory: {
          connect: {
            categoryName: category
          }
        },
        weight,
        costPrice,
        retailPrice,
        supplier: {
          connect: {
            supplierID: supplierID
          }
        },
        active,
        notes,
        caseSize,
      }
      const updatedItem = await this.prisma.item.update({
        where:{
          itemID:item.item.itemID
        },
        data:data
      });
      return updatedItem
    } catch (error) {
      console.error(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
