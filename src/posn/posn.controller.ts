import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PosnService } from './posn.service';
import { CreatePosnDto } from './dto/create-posn.dto';
import { UpdatePosnDto } from './dto/update-posn.dto';

@Controller('posn')
export class PosnController {
  constructor(private readonly posnService: PosnService) {}

  @Post()
  create(@Body() createPosnDto: CreatePosnDto) {
    return this.posnService.create(createPosnDto);
  }

  @Get()
  findAll() {
    return this.posnService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.posnService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePosnDto: UpdatePosnDto) {
    return this.posnService.update(+id, updatePosnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.posnService.remove(+id);
  }
}
