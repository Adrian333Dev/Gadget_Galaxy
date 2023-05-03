import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: 'j0hnd03' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'johndoe@gmail.com' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class SignInDto extends SignUpDto {
  @IsEmpty()
  username: string;
}

export class UpdateUserDto extends PartialType(SignUpDto) {
  @IsEmpty()
  password: string;

  @IsEmpty()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
