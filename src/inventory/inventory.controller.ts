import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  create(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.create(createInventoryDto);
  }

  @Get()
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get('getall')
  findAllCustomer() {
    return this.inventoryService.findAllCustomer();
  }

  @Get(':id')
  findStoreInv(@Param('id') id: string) {
    return this.inventoryService.findStoreInv(+id);
  }

  @Post('update/transit/:id')
  updateTruckInv(@Param('id') id: string, @Body() {items}:any) {
    console.log(items);
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
    return this.inventoryService.updateManyTransit(+id, items);
  }

  @Post('update/:id')
  updateStoreInv(@Param('id') id: string, @Body() {updateInventoryDto, createInventoryDto}:any) {
    console.log(updateInventoryDto);
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
    console.log(createInventoryDto)
    return this.inventoryService.updateMany(+id, updateInventoryDto,createInventoryDto);
  }

  @Post('deliver/:id')
  moveStoreInv(@Param('id') id: string, @Body() txnitems:any[]) {
    console.log(txnitems);
    return this.inventoryService.moveFromTruckToStore(+id, txnitems);
  }

  


  @Post('update/single/:id')
  update(@Param('id') id: string, @Body() updateInventoryDto: any) {
    return this.inventoryService.updateOne(+id, updateInventoryDto.item);
  }

  @Delete('removeInv/:id')
  remove(@Param('id') id: string,@Body() {inventoryDto}: any) {
    return this.inventoryService.removeItems(+id, inventoryDto);
  }
  //REPORTS 
  @Post('report')
  inventoryReport(@Body() info:any) {
    return this.inventoryService.inventoryReport(info);
  }
}
