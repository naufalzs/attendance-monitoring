import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Role } from './role.enum';
import * as bcrypt from 'bcrypt';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

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

  findAll() {
    return this.employees.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employees.findOneBy({ id });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    return employee;
  }

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const { password, ...rest } = dto;
    await this.checkEmail(rest.email);
    const saved = await this.employees.save(
      this.employees.create({
        ...rest,
        passwordHash: await bcrypt.hash(password, BCRYPT_ROUNDS),
      }),
    );
    return this.findOne(saved.id);
  }

  async update(id: string, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);
    const { password, ...rest } = dto;
    if (rest.email && rest.email !== employee.email) {
      await this.checkEmail(rest.email);
    }

    await this.employees.update(id, {
      ...rest,
      ...(password && {
        passwordHash: await bcrypt.hash(password, BCRYPT_ROUNDS),
      }),
    });

    return this.findOne(id);
  }

  private async checkEmail(email: string): Promise<void> {
    if (await this.employees.exists({ where: { email } })) {
      throw new ConflictException('Email already exists');
    }
  }
}
