import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Between,
  FindOptionsSelect,
  IsNull,
  QueryFailedError,
  Repository,
} from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from '../auth/jwt-payload.interface';
import {
  AdminAttendanceQueryDto,
  DateRangeQueryDto,
} from './dto/attendance-query.dto';

const PG_UNIQUE_VIOLATION = '23505';

// read shortcut to returns attendance with employee data
const WITH_EMPLOYEE = {
  relations: { employee: true },
  select: {
    id: true,
    employeeId: true,
    date: true,
    clockInAt: true,
    clockOutAt: true,
    employee: { id: true, name: true },
  } satisfies FindOptionsSelect<Attendance>,
};

// use en-CA to prevent timezone confusion and postgres date read issues
const jakartaDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Jakarta',
});

function todayInJakarta(): string {
  return jakartaDate.format(new Date());
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendance: Repository<Attendance>,
  ) {}

  async clockIn(user: JwtPayload): Promise<Attendance> {
    const date = todayInJakarta();
    try {
      const { id } = await this.attendance.save(
        this.attendance.create({
          employeeId: user.sub,
          date,
          clockInAt: new Date(),
          clockOutAt: null,
        }),
      );
      return await this.attendance.findOneOrFail({
        where: { id },
        ...WITH_EMPLOYEE,
      });
    } catch (error) {
      const driverError: unknown =
        error instanceof QueryFailedError ? error.driverError : undefined;
      if (
        typeof driverError === 'object' &&
        driverError !== null &&
        'code' in driverError &&
        driverError.code === PG_UNIQUE_VIOLATION
      ) {
        throw new ConflictException('You already clocked in today');
      }
      throw error;
    }
  }

  async clockOut(user: JwtPayload): Promise<Attendance> {
    const date = todayInJakarta();
    const record = await this.attendance.findOneBy({
      employeeId: user.sub,
      date,
    });

    if (!record) {
      throw new NotFoundException("You haven't clocked in today");
    }

    const { affected } = await this.attendance.update(
      { id: record.id, clockOutAt: IsNull() },
      { clockOutAt: new Date() },
    );

    if (!affected) {
      throw new NotFoundException('you already clocked out today');
    }

    return this.attendance.findOneOrFail({
      where: { id: record.id },
      ...WITH_EMPLOYEE,
    });
  }

  findMine(user: JwtPayload, query: DateRangeQueryDto): Promise<Attendance[]> {
    const { from, to } = this.resolveRange(query);
    return this.attendance.find({
      where: {
        employeeId: user.sub,
        date: Between(from, to),
      },
      order: { date: 'ASC' },
      ...WITH_EMPLOYEE,
    });
  }

  async findAll(
    query: AdminAttendanceQueryDto,
  ): Promise<Paginated<Attendance>> {
    const { from, to } = this.resolveRange(query);
    const { employeeId, page, limit } = query;
    const [data, total] = await this.attendance.findAndCount({
      where: {
        date: Between(from, to),
        ...(employeeId && { employeeId }),
      },
      order: { date: 'DESC', employee: { name: 'ASC' } },
      skip: (page - 1) * limit,
      take: limit,
      ...WITH_EMPLOYEE,
    });
    return { data, total, page, limit };
  }

  private resolveRange(query: DateRangeQueryDto): { from: string; to: string } {
    const today = todayInJakarta();
    const from = query.from ?? `${today.slice(0, 8)}01`;
    const to = query.to ?? today;
    if (from > to) {
      throw new BadRequestException('From must be before To');
    }
    return { from, to };
  }
}
