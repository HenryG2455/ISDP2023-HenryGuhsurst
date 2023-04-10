import { Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SupplierService {
  constructor(private prisma: PrismaService){}
  create(createSupplierDto: CreateSupplierDto) {
    return 'This action adds a new supplier';
  }

  async findAll() {
    try {
      const sups = await this.prisma.supplier.findMany();
      return sups;
    } catch (error) {
      console.error(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} supplier`;
  }

  update(id: number, updateSupplierDto: UpdateSupplierDto) {
    return `This action updates a #${id} supplier`;
  }

  remove(id: number) {
    return `This action removes a #${id} supplier`;
  }
}
