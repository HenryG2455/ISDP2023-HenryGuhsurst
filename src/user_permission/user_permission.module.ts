import { Module } from '@nestjs/common';
import { UserPermissionService } from './user_permission.service';
import { UserPermissionController } from './user_permission.controller';

@Module({
  controllers: [UserPermissionController],
  providers: [UserPermissionService]
})
export class UserPermissionModule {}
