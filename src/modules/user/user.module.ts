import { Module } from '@nestjs/common';
import { UserController } from 'src/controller/user/user.controller';
import { UserService } from 'src/service/user/user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
