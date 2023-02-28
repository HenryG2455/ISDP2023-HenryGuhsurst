export class CreateInventoryDto {
  itemID:number
  siteID:number
  quantity:number
  itemLocation:string
  reorderThreshold: number
}
