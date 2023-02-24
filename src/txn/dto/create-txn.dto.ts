import { Txn } from "../entities/txn.entity";
export class CreateTxnDto extends Txn {
    siteIDTo: number;
    siteIDFrom: number; 
    status:string;
    shipDate:Date; 
    txnType:string;
    barCode:string;
    createdDate:Date;
    deliveryID?:number;
    emergencyDelivery?:boolean;
}
