import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../../../framework/decorators/user.decorator';
import { JwtAtGuard } from '../../../framework/guards/jwt-at.guard';
import { JwtRtGuard } from '../../../framework/guards/jwt-rt.guard';
import { CreateUserDto } from '../../users/dtos/createUser.dto';
import { AuthDto } from '../dtos/auth.dto';
import { AuthService } from '../services/auth.service.abstract';
import { JwtPayload } from '../types/tokens.type';

import type { Tokens } from '../types/tokens.type';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  @HttpCode(HttpStatus.CREATED)
  public async signin(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signin(dto);
  }

  @Post('signup')
  @HttpCode(HttpStatus.OK)
  public async signup(@Body() dto: CreateUserDto): Promise<Tokens> {
    return this.authService.signup(dto);
  }

  @UseGuards(JwtAtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public async logout(@User('sub') sub: string): Promise<void> {
    await this.authService.logout(sub);
  }

  @UseGuards(JwtRtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  public async refresh(@User() user:JwtPayload): Promise<Tokens> {
    return this.authService.refresh(
      user.sub,
      user?.refreshToken as string,
    );
  }

}
