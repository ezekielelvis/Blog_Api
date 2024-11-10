import { ApiProperty } from '@nestjs/swagger';
export class CreateUser {
  @ApiProperty()
  email: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}
