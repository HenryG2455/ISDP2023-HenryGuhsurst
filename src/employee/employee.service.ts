import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { employee, Prisma } from "@prisma/client";
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService){}

  async create(createEmployeeDto: CreateEmployeeDto) {
    let { firstName, lastName, password, username, email } = createEmployeeDto;

		const data: Prisma.employeeCreateInput = {
			firstName,
			lastName,
			username,
			email,
			password,
			active: true,
			locked: false,
			txnaudit: undefined,
			posn: {
				connect: {
					positionID: createEmployeeDto.positionID,
				},
			},
			site: {
				connect: {
					siteID: createEmployeeDto.siteID,
				},
			},
		};

		
    try {
      const newEmp = await this.prisma.employee.create({
        data
      });
      return newEmp;
    } catch (error) {
      console.error(error);
    }
  }

  findAll() {
    return this.prisma.employee.findMany();
  }

  async findOne(id: string) {
    const employee = await this.prisma.employee.findFirstOrThrow({
      where: {
        username: id   
      },
      include:{
        user_permission:true,
        site:true
      }
  });
  return employee;
  }

  update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  remove(id: string) {
    return `This action removes a #${id} employee`;
  }
}
