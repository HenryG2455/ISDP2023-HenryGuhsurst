import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SitetypeService } from './sitetype.service';
import { CreateSitetypeDto } from './dto/create-sitetype.dto';
import { UpdateSitetypeDto } from './dto/update-sitetype.dto';

@Controller('sitetype')
export class SitetypeController {
  constructor(private readonly sitetypeService: SitetypeService) {}

  @Post()
  create(@Body() createSitetypeDto: CreateSitetypeDto) {
    return this.sitetypeService.create(createSitetypeDto);
  }

  @Get()
  findAll() {
    return this.sitetypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sitetypeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSitetypeDto: UpdateSitetypeDto) {
    return this.sitetypeService.update(+id, updateSitetypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sitetypeService.remove(+id);
  }
}
