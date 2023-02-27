import { Injectable } from '@nestjs/common';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { PrismaService } from '../prisma/prisma.service';
import { employee, Prisma } from "@prisma/client";


@Injectable()
export class SiteService {
  constructor(private prisma: PrismaService){}


  async create(createSiteDto: CreateSiteDto) {
    try {
      let { name, address, address2, city, country, postalCode, phone,dayOfWeek,distanceFromWH,notes,active,provinceID,siteType} = createSiteDto;
      const tempDay = parseInt(dayOfWeek)
      const data:Prisma.siteCreateInput = {
        name,
        address,
        address2,
        city,
        country,
        postalCode,
        phone,
        dayOfWeek,
        distanceFromWH,
        notes,
        active,
        sitetype:{
          connect:{
            siteType
          }
        },
        province:{
          connect:{
            provinceID
          }
        },
      }
      const site = await this.prisma.site.create({data});
      return site;
    } catch (error) {
      console.error(error);
    }
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

  async update(id: number, updateSiteDto: UpdateSiteDto) {
    let { name, address, address2, city, country, postalCode, phone,dayOfWeek,distanceFromWH,notes,active,provinceID,siteType} = updateSiteDto;
    const data:Prisma.siteUpdateInput = {
      name,
      address,
      address2,
      city,
      country,
      postalCode,
      phone,
      dayOfWeek,
      distanceFromWH,
      notes,
      active,
      sitetype:{
        connect:{
          siteType
        }
      },
      province:{
        connect:{
          provinceID
        }
      },
    }
    const User = await this.prisma.site.update({
      where: {
        siteID: id,
      },
      data
    })
    return User;;
  }

  remove(id: number) {
    return `This action removes a #${id} site`;
  }
}
