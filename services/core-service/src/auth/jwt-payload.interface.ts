import type { Role } from '../employees/role.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: Role;
}
