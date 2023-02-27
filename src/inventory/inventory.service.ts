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

  update(id: number, updateInventoryDto: UpdateInventoryDto) {
    return `This action updates a #${id} inventory`;
  }

  remove(id: number) {
    return `This action removes a #${id} inventory`;
  }
}
