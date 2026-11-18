import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/jwt-payload.interface';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';

const MAX_PHOTO_BYTES = 2 * 1024 * 1024;

const PHOTO_EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

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

  @Patch('photo')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { photo: { type: 'string', format: 'binary' } },
      required: ['photo'],
    },
  })
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) =>
          cb(
            null,
            `${randomUUID()}${PHOTO_EXTENSIONS[file.mimetype].toLowerCase()}`,
          ),
      }),
    }),
  )
  updatePhoto(
    @CurrentUser() user: JwtPayload,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_PHOTO_BYTES }),
          new FileTypeValidator({
            fileType: /^image\/(jpeg|png|webp)$/,
            skipMagicNumbersValidation: true,
          }),
        ],
      }),
    )
    photo: Express.Multer.File,
  ) {
    return this.profileService.updatePhoto(user.sub, photo.filename);
  }
}
