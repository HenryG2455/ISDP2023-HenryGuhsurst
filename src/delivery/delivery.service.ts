import { Injectable } from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class DeliveryService {
  constructor(private prisma: PrismaService){}
  create(createDeliveryDto: CreateDeliveryDto) {
    return 'This action adds a new delivery';
  }

  async findAll() {
    try {
      const deliverys = await this.prisma.delivery.findMany();
      return deliverys;
    } catch (error) {
      console.error(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} delivery`;
  }

  update(id: number, updateDeliveryDto: UpdateDeliveryDto) {
    return `This action updates a #${id} delivery`;
  }

  remove(id: number) {
    return `This action removes a #${id} delivery`;
  }
}
