import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Role } from './role.enum';
import * as bcrypt from 'bcrypt';

const BCRYPT_ROUNDS = 10;

@Injectable()
export class EmployeesService implements OnApplicationBootstrap {
  private readonly logger = new Logger(EmployeesService.name);

  constructor(
    @InjectRepository(Employee)
    private readonly employees: Repository<Employee>,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    if (await this.employees.exists({ where: { role: Role.ADMIN } })) {
      return;
    }

    const email = this.config.getOrThrow<string>('ADMIN_EMAIL');

    await this.employees.save({
      name: 'Administrator',
      email,
      passwordHash: await bcrypt.hash(
        this.config.getOrThrow<string>('ADMIN_PASSWORD'),
        BCRYPT_ROUNDS,
      ),
      position: 'System Administrator',
      phone: '+6281234567890',
      photoUrl: null,
      role: Role.ADMIN,
    });
    this.logger.log(`Seeded admin account ${email}`);
  }

  findByEmailWithPassword(email: string): Promise<Employee | null> {
    return this.employees
      .createQueryBuilder('employee')
      .addSelect('employee.passwordHash')
      .where('employee.email = :email', { email })
      .getOne();
  }
}
