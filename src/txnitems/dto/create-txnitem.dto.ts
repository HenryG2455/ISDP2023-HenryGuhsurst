import { Txnitem } from "../entities/txnitem.entity";
export class CreateTxnitemDto extends Txnitem {
    ItemID: number;
    quantity: number;
}
