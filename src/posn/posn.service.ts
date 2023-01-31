import { Injectable } from '@nestjs/common';
import { CreatePosnDto } from './dto/create-posn.dto';
import { UpdatePosnDto } from './dto/update-posn.dto';

@Injectable()
export class PosnService {
  create(createPosnDto: CreatePosnDto) {
    return 'This action adds a new posn';
  }

  findAll() {
    return `This action returns all posn`;
  }

  findOne(id: number) {
    return `This action returns a #${id} posn`;
  }

  update(id: number, updatePosnDto: UpdatePosnDto) {
    return `This action updates a #${id} posn`;
  }

  remove(id: number) {
    return `This action removes a #${id} posn`;
  }
}
