/** DI token for the RabbitMQ client publishing to the `audit_log` queue. */
export const LOG_QUEUE = 'LOG_QUEUE';

export const PROFILE_UPDATED = 'employee.profile_updated';

export type ProfileChange = 'phone' | 'photo' | 'password';

export interface ProfileUpdatedEvent {
  employeeId: string;
  name: string;
  changes: ProfileChange[];
  at: string;
}
