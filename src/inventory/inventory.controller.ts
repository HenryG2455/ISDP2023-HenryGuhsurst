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

  @Get(':id')
  findStoreInv(@Param('id') id: string) {
    return this.inventoryService.findStoreInv(+id);
  }

  @Post('update/:id')
  updateStoreInv(@Param('id') id: string, @Body() updateInventoryDto: any) {
    console.log(updateInventoryDto.updateInventoryDto);
    return this.inventoryService.updateMany(+id, updateInventoryDto.updateInventoryDto);
  }


  @Post('update/single/:id')
  update(@Param('id') id: string, @Body() updateInventoryDto: any) {
    return this.inventoryService.updateOne(+id, updateInventoryDto.item);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(+id);
  }
}
