import { Injectable } from '@nestjs/common';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { employee, Prisma } from "@prisma/client";
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProvinceService {
  constructor(private prisma: PrismaService){}
  create(createProvinceDto: CreateProvinceDto) {
    return 'This action adds a new province';
  }

  findAll() {
    const provinces = this.prisma.province.findMany({});
    return provinces;
  }

  findOne(id: number) {
    return `This action returns a #${id} province`;
  }

  update(id: number, updateProvinceDto: UpdateProvinceDto) {
    return `This action updates a #${id} province`;
  }

  remove(id: number) {
    return `This action removes a #${id} province`;
  }
}
