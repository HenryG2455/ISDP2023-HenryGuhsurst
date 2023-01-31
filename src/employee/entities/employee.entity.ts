import { Prisma } from "@prisma/client";

export class Employee implements Prisma.employeeUncheckedCreateInput {
    employeeID: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email?: string;
    active?: boolean;
    locked: boolean;
    positionID: number;
    siteID: number;
    txnaudit?: Prisma.txnauditUncheckedCreateNestedManyWithoutEmployeeInput;
}
