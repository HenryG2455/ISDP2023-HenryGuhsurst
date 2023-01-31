import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TxnService } from './txn.service';
import { CreateTxnDto } from './dto/create-txn.dto';
import { UpdateTxnDto } from './dto/update-txn.dto';

@Controller('txn')
export class TxnController {
  constructor(private readonly txnService: TxnService) {}

  @Post()
  create(@Body() createTxnDto: CreateTxnDto) {
    return this.txnService.create(createTxnDto);
  }

  @Get()
  findAll() {
    return this.txnService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.txnService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTxnDto: UpdateTxnDto) {
    return this.txnService.update(+id, updateTxnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.txnService.remove(+id);
  }
}
