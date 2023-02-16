import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { PosnModule } from './posn/posn.module';
import { UserPermissionModule } from './user_permission/user_permission.module';
import { TxnModule } from './txn/txn.module';
import { TxnauditModule } from './txnaudit/txnaudit.module';
import { PermissionModule } from './permission/permission.module';

@Module({
  imports: [EmployeeModule, PosnModule, UserPermissionModule, TxnModule, TxnauditModule, PermissionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
