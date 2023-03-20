import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VehicleService {
  constructor(private prisma: PrismaService){}
  create(createVehicleDto: CreateVehicleDto) {
    return 'This action adds a new vehicle';
  }

  async findAll() {
    try {
      const vehicles = await this.prisma.vehicle.findMany();
      return vehicles;
    } catch (error) {
      console.error(error);
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} vehicle`;
  }

  update(id: number, updateVehicleDto: UpdateVehicleDto) {
    return `This action updates a #${id} vehicle`;
  }

  remove(id: number) {
    return `This action removes a #${id} vehicle`;
  }
}
