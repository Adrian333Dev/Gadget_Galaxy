import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class UserEntity implements User {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 'John123' })
  username: string;

  @ApiProperty({ example: 'johndoe@gmail.com' })
  email: string;

  @ApiProperty({ example: 'password123' })
  password: string;
}
