import { Controller, Delete } from '@nestjs/common';
import { UserService } from '../../service/user/user.service';
import { Body, Post, Get, Param, Put } from '@nestjs/common';
import { CreateUser } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUser: CreateUser) {
    return await this.userService.create(createUser);
  }

  @Get()
  async findAll() {
    return await this.userService.findall();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findone(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.upDateUser(updateUserDto, id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.userService.delete(id);
  }
}
