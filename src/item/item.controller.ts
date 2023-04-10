import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  findAll() {
    return this.itemService.findAll();
  }

  @Get('count')
  findCount() {
    return this.itemService.findCount();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(+id);
  }

  @Post('get/orderitems')
  findMany( @Body() itemIds: number[]) {
    return this.itemService.findMany(itemIds);
  }

  @Post('update')
  update( @Body() item: any, @Body() user:any) {
    return this.itemService.update(item,user);
  }
  
  @Post('remove')
  deactivate( @Body() itemId: any, @Body() user:any) {
    return this.itemService.deactivate(+itemId.itemID);
  }

  @Post('create/newitem')
  makeItem( @Body() tempItem:any, @Body() user:any) {
    return this.itemService.create(tempItem ,user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemService.remove(+id);
  }
}
