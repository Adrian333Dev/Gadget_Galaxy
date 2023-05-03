import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './user.dto';
import { UserEntity } from './user.entity';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiCreatedResponse({ type: UserEntity, isArray: true })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':userId')
  @ApiCreatedResponse({ type: UserEntity })
  findOneById(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.findOneByField({ userId });
  }

  @Post('signup')
  @ApiCreatedResponse({ type: UserEntity })
  signUp(@Body() createUserDto: SignUpDto) {
    return this.usersService.create(createUserDto);
  }
}
