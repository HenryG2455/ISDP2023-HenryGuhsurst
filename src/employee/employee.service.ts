import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { employee, Prisma } from "@prisma/client";
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService){}

  exclude(user, keys) {
    for (let key of keys) {
      delete user[key]
    }
    return user
  }

  async create(createEmployeeDto: CreateEmployeeDto) {
    let { firstName, lastName, password, username, email, positionID, siteID} = createEmployeeDto;
    console.log(firstName+" : "+positionID +" : "+siteID);
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
					positionID
				},
			},
			site: {
				connect: {
					siteID
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

  async findAll() {
    const employees = await this.prisma.employee.findMany({
      include:{
        site:true,
        posn:true
      }
    });
    const empsWithoutPasswords = employees.map(user => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })
    return empsWithoutPasswords
  }

  findAllAdmin() {
    const employees = this.prisma.employee.findMany({
      include:{
        user_permission:true,
        site:true,
        posn:true
      }
    });
    return employees
  }

  async findOne(id: string) {
    const employee = await this.prisma.employee.findFirstOrThrow({
      where: {
        username: id   
      },
      include:{
        user_permission:true,
        site:true,
        posn:true
      }
  });
  return employee;
  }

  update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  //Delete function
  async remove(id: string) {
    const tempID:number = parseInt(id);
    const deleteUser = await this.prisma.employee.delete({
      where: {
        employeeID: tempID,
      },
    })
    return deleteUser;
  }

  async setInactive(id: string) {
    const tempID:number = parseInt(id);
    const User = await this.prisma.employee.update({
      where: {
        employeeID: tempID,
      },
      data:{
        active: false,
      }
    })
    return User;
  }

  //Reports

  async report(info:any) {
    try {
      if(info.location === 'all'){
        const emps = await this.prisma.employee.findMany({
          include:{
            site: true,
            posn: true,
          }
        })
        console.log(emps)
        const formattedData = emps.map((emp) => {
          return {
            id: emp.employeeID,
            name: emp.firstName=' '+emp.lastName,
            username: emp.username,
            site: emp.site.name,
            position: emp.posn.permissionLevel,
            active: emp.active?'Yes':'No',
            email: emp.email,
          };
        });
        return formattedData;
      }else{
        const emps = await this.prisma.employee.findMany({
          where:{
            siteID: +info.location
          },
          include:{
            site: true,
            posn: true,
          }
        })
        console.log(emps)
        const formattedData = emps.map((emp) => {
          return {
            id: emp.employeeID,
            name: emp.firstName=' '+emp.lastName,
            username: emp.username,
            site: emp.site.name,
            position: emp.posn.permissionLevel,
            active: emp.active?'Yes':'No',
            email: emp.email,
          };
        });
        return formattedData;
      }
    } catch (error) {
      console.error(error);
    }
  }
}
