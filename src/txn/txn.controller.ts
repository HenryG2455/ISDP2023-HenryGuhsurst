import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TxnService } from './txn.service';
import { CreateTxnDto } from './dto/create-txn.dto';
import { UpdateTxnDto } from './dto/update-txn.dto';

@Controller('txn')
export class TxnController {
  constructor(private readonly txnService: TxnService) {}

  

  @Get()
  findAll() {
    return this.txnService.findAll();
  }

  @Get('orders/getall')
  findAllOrders() {
    return this.txnService.findAllOrders();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.txnService.findOne(+id);
  }

  @Post('storeOrder/update/:id')
  updateStoreOrder(@Param('id') id: string,@Body() updateinfo: any) {
    let txn =updateinfo.txn;
    let removedItems = updateinfo.removedItems;
    return this.txnService.updateStoreOrder(+id,txn, removedItems);
  }

  @Post('storeOrder/new')
  create(@Body() createTxnDto: any) {
    let txn =createTxnDto.txn;
    let txnItems = createTxnDto.txnItems
    console.log(txn)
    console.log(txnItems)
    return this.txnService.create(txn,txnItems);
  }


  @Post('backOrder/new')
  createBackOrder(@Body() createTxnDto: any) {
    let txn =createTxnDto.txn;
    let txnItems = createTxnDto.txnItems
    return this.txnService.create(txn,txnItems);
  }

  @Post('backOrder/update/:id')
  updateBackOrder(@Param('id') id:string, @Body() createTxnDto: any) {
    let txn =createTxnDto.txn;
    let txnItems = createTxnDto.txnItems
    return this.txnService.updateBackOrder(+id,txn,txnItems);
  }

  @Post('process/order/:id')
  porcessOrder(@Param('id') id: string) {
    return this.txnService.porcessOrder(+id);
  }

  @Post('ready/order/:id')
  readyOrder(@Param('id') id: string, @Body() updateTxnDto: UpdateTxnDto) {
    return this.txnService.readyOrder(+id,updateTxnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.txnService.remove(+id);
  }
}
