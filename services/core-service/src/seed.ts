import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { AppModule } from './app.module';
import { Attendance } from './attendance/entities/attendance.entity';
import { BCRYPT_ROUNDS } from './common/constants';
import { Employee } from './employees/entities/employee.entity';
import { Role } from './employees/role.enum';

const DEMO_PASSWORD = 'password123';
const DAYS_PER_EMPLOYEE = 10;

// Days (0 = most recent weekday) each demo employee forgot to clock out, keyed by
// DEMO_EMPLOYEES index. Admin table sorts date DESC then name ASC, so these land
// on rows 1, 3 and 8 of page 1 — visible and never adjacent.
const MISSING_CLOCK_OUT_DAYS: number[][] = [[0], [0], [2]];

const DEMO_EMPLOYEES = [
  {
    name: 'Naufal',
    email: 'naufal@company.com',
    position: 'Software Engineer',
    phone: '081234567801',
  },
  {
    name: 'Dewa',
    email: 'dewa@company.com',
    position: 'HR Staff',
    phone: '081234567802',
  },
  {
    name: 'Fauzan',
    email: 'fauzan@company.com',
    position: 'Product Designer',
    phone: '081234567803',
  },
];

const jakartaDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Jakarta',
});

function pastWeekdays(count: number): string[] {
  const day = new Date(`${jakartaDate.format(new Date())}T00:00:00Z`);
  const dates: string[] = [];
  while (dates.length < count) {
    day.setUTCDate(day.getUTCDate() - 1);
    const weekday = day.getUTCDay();
    if (weekday !== 0 && weekday !== 6) {
      dates.unshift(day.toISOString().slice(0, 10));
    }
  }
  return dates;
}

function jakartaTime(date: string, minutes: number): Date {
  const hh = String(Math.floor(minutes / 60)).padStart(2, '0');
  const mm = String(minutes % 60).padStart(2, '0');
  return new Date(`${date}T${hh}:${mm}:00+07:00`);
}

async function seed() {
  const logger = new Logger('Seed');
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const employees = app.get<Repository<Employee>>(
      getRepositoryToken(Employee),
    );
    const attendance = app.get<Repository<Attendance>>(
      getRepositoryToken(Attendance),
    );
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, BCRYPT_ROUNDS);
    const dates = pastWeekdays(DAYS_PER_EMPLOYEE);

    for (const [e, demo] of DEMO_EMPLOYEES.entries()) {
      const employee =
        (await employees.findOneBy({ email: demo.email })) ??
        (await employees.save({ ...demo, passwordHash, role: Role.EMPLOYEE }));

      const rows = dates.map((date, d) => ({
        employeeId: employee.id,
        date,
        clockInAt: jakartaTime(date, 7 * 60 + 45 + ((d * 7 + e * 11) % 45)),
        clockOutAt: MISSING_CLOCK_OUT_DAYS[e].includes(dates.length - 1 - d)
          ? null
          : jakartaTime(date, 17 * 60 + ((d * 13 + e * 5) % 45)),
      }));

      const result = await attendance
        .createQueryBuilder()
        .insert()
        .into(Attendance)
        .values(rows)
        .orIgnore()
        .execute();

      logger.log(
        `${demo.email}: ${result.identifiers.filter(Boolean).length} attendance rows added`,
      );
    }

    logger.log(`Done. Demo employees log in with password "${DEMO_PASSWORD}"`);
  } finally {
    await app.close();
  }
}

void seed();
