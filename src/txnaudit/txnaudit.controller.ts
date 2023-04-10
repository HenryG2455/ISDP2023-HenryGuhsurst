import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TxnauditService } from './txnaudit.service';
import { CreateTxnauditDto } from './dto/create-txnaudit.dto';
import { UpdateTxnauditDto } from './dto/update-txnaudit.dto';

@Controller('txnaudit')
export class TxnauditController {
  constructor(private readonly txnauditService: TxnauditService) {}

  @Post()
  create(@Body() createTxnauditDto: CreateTxnauditDto, user: any) {
    return this.txnauditService.create(createTxnauditDto);
  }

  @Get()
  findAll() {
    return this.txnauditService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.txnauditService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTxnauditDto: UpdateTxnauditDto) {
    return this.txnauditService.update(+id, updateTxnauditDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.txnauditService.remove(+id);
  }
}
