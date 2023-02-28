import { PartialType } from '@nestjs/mapped-types';
import { CreateTxnDto } from './create-txn.dto';

export class UpdateTxnDto extends PartialType(CreateTxnDto) {
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
