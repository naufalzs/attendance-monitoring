import { Controller, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PROFILE_UPDATED } from './events/profile-updated.event';
import type { ProfileUpdatedEvent } from './events/profile-updated.event';

@Controller()
export class AuditLogsController {
  private readonly logger = new Logger(AuditLogsController.name);

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogs: Repository<AuditLog>,
  ) {}

  @EventPattern(PROFILE_UPDATED)
  async onProfileUpdated(@Payload() event: ProfileUpdatedEvent): Promise<void> {
    await this.auditLogs.save(
      this.auditLogs.create({
        employeeId: event.employeeId,
        action: PROFILE_UPDATED,
        payload: { ...event },
      }),
    );
    this.logger.log(
      `${PROFILE_UPDATED} ${event.employeeId} [${event.changes.join(', ')}]`,
    );
  }
}
