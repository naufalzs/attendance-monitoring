import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../employees/role.enum';
import { FirebaseService } from '../firebase/firebase.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { JwtPayload } from './jwt-payload.interface';
import { Public } from './public.decorator';
import { Roles } from './roles.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly firebase: FirebaseService,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @Get('firebase-token')
  async firebaseToken(@CurrentUser() user: JwtPayload) {
    return {
      token: await this.firebase.createCustomToken(user.sub, user.role),
    };
  }
}
