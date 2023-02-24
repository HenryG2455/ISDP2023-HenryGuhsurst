import { Injectable } from '@nestjs/common';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class SiteService {
  constructor(private prisma: PrismaService){}
  create(createSiteDto: CreateSiteDto) {
    return 'This action adds a new site';
  }

  async findAll() {
    try {
      const sites = await this.prisma.site.findMany();
      return sites;
    } catch (error) {
      console.error(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} site`;
  }

  update(id: number, updateSiteDto: UpdateSiteDto) {
    return `This action updates a #${id} site`;
  }

  remove(id: number) {
    return `This action removes a #${id} site`;
  }
}
