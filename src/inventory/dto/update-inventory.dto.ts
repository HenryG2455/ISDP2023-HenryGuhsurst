import { PartialType } from '@nestjs/mapped-types';
import { CreateInventoryDto } from './create-inventory.dto';

export class UpdateInventoryDto extends PartialType(CreateInventoryDto) {
    itemID:number
    siteID:number
    quantity:number
    itemLocation:string
    reorderThreshold: number
}
