import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }
  
  @Post('active/:id')
  setInactive(@Param('id') id: string) {
    return this.employeeService.setInactive(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Get('admin/getall')
  findAllAdmin() {
    return this.employeeService.findAllAdmin();
  }

  @Get()
  findAll() {
    return this.employeeService.findAll();
  }
  
  //REPORTS
  @Post('report')
  emergencyReport(@Body() info: any) {
    return this.employeeService.report(info);
  }
  
  

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

 

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }
}
