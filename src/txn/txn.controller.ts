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
  @Get('orders/getall/acadia')
  findAllReadyOrders() {
    return this.txnService.findAllReadyOrders();
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

  @Post('storeOrder/close/:id')
  closeStoreOrder(@Param('id') id: string,@Body() txn: any) {
    return this.txnService.closeStoreOrder(+id);
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
  @Post('deliver/order/:id')
  deliverOrder(@Param('id') id: string) {
    return this.txnService.deliverOrder(+id);
  }

  @Post('process/order/:id')
  porcessOrder(@Param('id') id: string) {
    return this.txnService.porcessOrder(+id);
  }

  @Post('transit/order/:id')
  transitOrder(@Param('id') id: string, @Body() deliveryID: any) {
    console.log(deliveryID.deliveryID);
    return this.txnService.transitOrder(+id,+deliveryID.deliveryID);
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
