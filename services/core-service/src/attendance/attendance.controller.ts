import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/jwt-payload.interface';
import {
  AdminAttendanceQueryDto,
  DateRangeQueryDto,
} from './dto/attendance-query.dto';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../employees/role.enum';

@ApiTags('attendance')
@ApiBearerAuth()
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('clock-in')
  clockIn(@CurrentUser() user: JwtPayload) {
    return this.attendanceService.clockIn(user);
  }

  @Post('clock-out')
  clockOut(@CurrentUser() user: JwtPayload) {
    return this.attendanceService.clockOut(user);
  }

  @Get('me')
  findMine(@CurrentUser() user: JwtPayload, @Query() query: DateRangeQueryDto) {
    return this.attendanceService.findMine(user, query);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll(@Query() query: AdminAttendanceQueryDto) {
    return this.attendanceService.findAll(query);
  }
}
