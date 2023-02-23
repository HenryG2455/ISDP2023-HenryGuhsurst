import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TxnitemsService } from './txnitems.service';
import { CreateTxnitemDto } from './dto/create-txnitem.dto';
import { UpdateTxnitemDto } from './dto/update-txnitem.dto';

@Controller('txnitems')
export class TxnitemsController {
  constructor(private readonly txnitemsService: TxnitemsService) {}

  @Post()
  create(@Body() createTxnitemDto: CreateTxnitemDto) {
    return this.txnitemsService.create(createTxnitemDto);
  }

  @Get()
  findAll() {
    return this.txnitemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.txnitemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTxnitemDto: UpdateTxnitemDto) {
    return this.txnitemsService.update(+id, updateTxnitemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.txnitemsService.remove(+id);
  }
}
