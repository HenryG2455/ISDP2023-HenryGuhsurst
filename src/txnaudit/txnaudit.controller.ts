import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TxnauditService } from './txnaudit.service';
import { CreateTxnauditDto } from './dto/create-txnaudit.dto';
import { UpdateTxnauditDto } from './dto/update-txnaudit.dto';

@Controller('txnaudit')
export class TxnauditController {
  constructor(private readonly txnauditService: TxnauditService) {}

  

  @Get()
  findAll() {
    return this.txnauditService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.txnauditService.findOne(+id);
  }

  @Post('new')
  create(@Body() info: any) {
    return this.txnauditService.create(info);
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
