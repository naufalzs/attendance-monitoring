export const PROFILE_UPDATED = 'employee.profile_updated';

export type ProfileChange = 'phone' | 'password' | 'photo';

export interface ProfileUpdatedEvent {
  employeeId: string;
  name: string;
  changes: ProfileChange[];
  at: string;
}
