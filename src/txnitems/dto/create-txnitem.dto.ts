import { Txnitem } from "../entities/txnitem.entity";
export class CreateTxnitemDto extends Txnitem {
    itemID: number;
    quantity: number;
}
