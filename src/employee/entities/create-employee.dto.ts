import { Employee } from "../entities/employee.entity";

export class CreateEmployeeDto extends Employee {
    password: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    positionID: number;
    siteID: number;
}