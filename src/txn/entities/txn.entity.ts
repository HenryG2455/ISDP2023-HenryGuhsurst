import { Prisma } from "@prisma/client";
export class Txn implements Prisma.txnUncheckedCreateInput {
    txnID: number;     
    siteIDTo: number;
    siteIDFrom: number; 
    status:string;
    shipDate:Date; 
    txnType:string;
    barCode:string;
    createdDate:Date;
    deliveryID?:number;
    emergencyDelivery?:boolean;
    notes:string;
}
