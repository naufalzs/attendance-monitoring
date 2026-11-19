import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Employee } from '../employees/entities/employee.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import {
  LOG_QUEUE,
  PROFILE_UPDATED,
  ProfileChange,
  ProfileUpdatedEvent,
} from './events/profile-updated.event';
import { ClientProxy } from '@nestjs/microservices';

const BCRYPT_ROUNDS = 10;

export type Profile = Pick<
  Employee,
  'name' | 'email' | 'photoUrl' | 'position' | 'phone'
>;

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    @InjectRepository(Employee)
    private readonly employees: Repository<Employee>,
    @Inject(LOG_QUEUE)
    private readonly logQueue: ClientProxy,
  ) {}

  async getMe(employeeId: string): Promise<Profile> {
    const employee = await this.employees.findOne({
      where: { id: employeeId },
      select: {
        name: true,
        email: true,
        photoUrl: true,
        position: true,
        phone: true,
      },
    });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    return employee;
  }

  async updatePhone(employeeId: string, dto: UpdatePhoneDto): Promise<Profile> {
    await this.getMe(employeeId);
    await this.employees.update(employeeId, { phone: dto.phone });
    const profile = await this.getMe(employeeId);
    this.publishProfileUpdated(employeeId, profile.name, ['phone']);
    return profile;
  }

  async changePassword(
    employeeId: string,
    dto: ChangePasswordDto,
  ): Promise<void> {
    const employee = await this.employees
      .createQueryBuilder('employee')
      .addSelect('employee.passwordHash')
      .where('employee.id = :id', { id: employeeId })
      .getOne();

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    if (!(await bcrypt.compare(dto.currentPassword, employee.passwordHash))) {
      throw new BadRequestException('Current password wrong');
    }

    await this.employees.update(employeeId, {
      passwordHash: await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS),
    });
    this.publishProfileUpdated(employeeId, employee.name, ['password']);
  }

  async updatePhoto(employeeId: string, filename: string): Promise<Profile> {
    await this.getMe(employeeId);
    await this.employees.update(employeeId, {
      photoUrl: `/uploads/${filename}`,
    });
    const profile = await this.getMe(employeeId);
    this.publishProfileUpdated(employeeId, profile.name, ['photo']);
    return profile;
  }

  private publishProfileUpdated(
    employeeId: string,
    name: string,
    changes: ProfileChange[],
  ) {
    const event: ProfileUpdatedEvent = {
      employeeId,
      name,
      changes,
      at: new Date().toISOString(),
    };
    this.logQueue.emit(PROFILE_UPDATED, event).subscribe({
      error: (error) => {
        this.logger.error(`Failed to publish ${PROFILE_UPDATED}`, error);
      },
    });
  }
}
