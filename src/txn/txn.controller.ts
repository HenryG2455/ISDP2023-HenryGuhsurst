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

  @Get('getall')
  findAllBeforeReady() {
    return this.txnService.findAll();
  }

  @Get('onlineOrder/find/:email/:txnID')
  findOnline(@Param('email') email: string, @Param('txnID') txnID: string) {
    return this.txnService.findAllCustOrders(email,+txnID);
  }

  @Get('orders/getall')
  findAllOrders() {
    return this.txnService.findAllOrders();
  }

  @Get('onlineorders/getall/:id')
  findAllOnlineOrders(@Param('id') id: string) {
    return this.txnService.findAllOnlineOrders(+id);
  }

  @Get('curbsideready/getall/:id')
  findAlReadyCurbside(@Param('id') id: string) {
    return this.txnService.findAllCurbsideReady(+id);
  }

  @Get('orders/getall/acadia')
  findAllReadyOrders() {
    return this.txnService.findAllReadyOrders();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.txnService.findOne(+id);
  }

  @Post('loss')
  loss(@Body() txn: any ,@Body() txnItems: any,@Body() user: any) {
    return this.txnService.createLR(txn,txnItems,user);
  }

  @Post('return')
  return(@Body() txn: any ,@Body() txnItems: any,@Body() user: any) {
    return this.txnService.createLR(txn,txnItems,user);
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

  @Post('cancel/:id')
  cancelTxn(@Param('id') id: string) {
    return this.txnService.cancelTxn(+id);
  }

  @Post('storeOrder/new')
  create(@Body() createTxnDto: any) {
    let txn =createTxnDto.txn;
    let txnItems = createTxnDto.txnItems
    console.log(txn)
    console.log(txnItems)
    return this.txnService.create(txn,txnItems);
  }

  @Post('onlineOrder/new')
  createOnline(@Body() createTxnDto: any) {
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

  @Post('close/order/:id')
  closerOrder(@Param('id') id: string) {
    return this.txnService.closeOrder(+id);
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
  
  

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.txnService.remove(+id);
  // }
}
