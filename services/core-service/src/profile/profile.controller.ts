import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/jwt-payload.interface';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

const MAX_PHOTO_BYTES = 2 * 1024 * 1024;

@ApiTags('profile')
@ApiBearerAuth()
@Controller('profile/me')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getMe(@CurrentUser() user: JwtPayload) {
    return this.profileService.getMe(user.sub);
  }

  @Patch('phone')
  updatePhone(@CurrentUser() user: JwtPayload, @Body() dto: UpdatePhoneDto) {
    return this.profileService.updatePhone(user.sub, dto);
  }

  @Patch('password')
  @HttpCode(HttpStatus.NO_CONTENT)
  changePassword(
    @CurrentUser() user: JwtPayload,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.profileService.changePassword(user.sub, dto);
  }
}
