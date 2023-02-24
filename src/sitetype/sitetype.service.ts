import { Injectable } from '@nestjs/common';
import { CreateSitetypeDto } from './dto/create-sitetype.dto';
import { UpdateSitetypeDto } from './dto/update-sitetype.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SitetypeService {
  constructor(private prisma: PrismaService){}
  create(createSitetypeDto: CreateSitetypeDto) {
    return 'This action adds a new sitetype';
  }

  findAll() {
    const sitetypes = this.prisma.sitetype.findMany({});
    return sitetypes;
  }

  findOne(id: number) {
    return `This action returns a #${id} sitetype`;
  }

  update(id: number, updateSitetypeDto: UpdateSitetypeDto) {
    return `This action updates a #${id} sitetype`;
  }

  remove(id: number) {
    return `This action removes a #${id} sitetype`;
  }
}
