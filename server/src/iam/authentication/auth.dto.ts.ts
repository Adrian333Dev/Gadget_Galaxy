import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength, IsNotEmpty, IsEmpty } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: 'j0hnd03' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'johndoe@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @MinLength(10)
  password: string;
}

export class SignInDto extends SignUpDto {
  @IsEmpty()
  username: string;
}

export class RefreshTokenDto {
  @IsNotEmpty()
  refreshToken: string;
}
