import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { PosnModule } from './posn/posn.module';
import { UserPermissionModule } from './user_permission/user_permission.module';
import { TxnModule } from './txn/txn.module';
import { TxnauditModule } from './txnaudit/txnaudit.module';
import { PermissionModule } from './permission/permission.module';
import { ItemModule } from './item/item.module';
import { InventoryModule } from './inventory/inventory.module';
import { SupplierModule } from './supplier/supplier.module';
import { TxnitemsModule } from './txnitems/txnitems.module';
import { SiteModule } from './site/site.module';
import { ProvinceModule } from './province/province.module';
import { SitetypeModule } from './sitetype/sitetype.module';

@Module({
  imports: [EmployeeModule, PosnModule, UserPermissionModule, TxnModule, TxnauditModule, PermissionModule, ItemModule, InventoryModule, SupplierModule, TxnitemsModule, SiteModule, ProvinceModule, SitetypeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
