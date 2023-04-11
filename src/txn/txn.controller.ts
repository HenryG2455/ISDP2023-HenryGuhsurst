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

  @Post('supplierOrder/new')
  createSupp(@Body() data: any) {
    console.log(data.txn)
    console.log(data.txnItems)
    return this.txnService.create(data.txn,data.txnItems, data.user);
  }

  @Post('supplierOrder/update')
  updateSupp(@Body() data: any) {
    console.log(data.txn)
    console.log(data.txnItems)
    return this.txnService.updateSuppOrder(data.txn,data.txnItems,data.removedItems, data.user);
  }

  @Post('supplierOrder/cancel/:id')
  cancelSupp(@Param('id') id: string, @Body() data: any) {
    return this.txnService.cancelTxn(+id);
  }

  @Post('storeOrder/new')
  create(@Body() createTxnDto: any) {
    let txn =createTxnDto.txn;
    let txnItems = createTxnDto.txnItems
    console.log(txn)
    console.log(txnItems)
    return this.txnService.create(txn,txnItems,createTxnDto.user);
  }

  @Post('onlineOrder/new')
  createOnline(@Body() createTxnDto: any) {
    let txn =createTxnDto.txn;
    let txnItems = createTxnDto.txnItems
    console.log(txn)
    console.log(txnItems)
    return this.txnService.create(txn,txnItems,createTxnDto.user);
  }


  @Post('backOrder/new')
  createBackOrder(@Body() createTxnDto: any) {
    let txn =createTxnDto.txn;
    let txnItems = createTxnDto.txnItems
    return this.txnService.create(txn,txnItems,createTxnDto.user);
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
  //REPORTS
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  @Post('delivery/report')
  deliveryReport(@Body() info: any) {
    return this.txnService.deliveryReport(info);
  }

  @Post('storeorder/report')
  SOReport(@Body() info: any) {
    return this.txnService.storeOrdersReport(info);
  }

  @Post('backorder/report')
  BOReport(@Body() info: any) {
    return this.txnService.backOrdersReport(info);
  }
  @Post('supplier/report')
  SuppOReport(@Body() info: any) {
    return this.txnService.suppOrdersReport(info);
  }

  @Post('shipping/report')
  ShippingReport(@Body() info: any) {
    return this.txnService.shippingReport(info);
  }

  @Post('orders/report')
  OrdersReport(@Body() info: any) {
    return this.txnService.ordersReport(info);
  }
  @Post('emergency/report')
  emergencyReport(@Body() info: any) {
    return this.txnService.emergencyReport(info);
  }

  @Post('lossreturn/report')
  lossReturnReport(@Body() info: any) {
    return this.txnService.lossReturnReport(info);
  }
  

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.txnService.remove(+id);
  // }
}
