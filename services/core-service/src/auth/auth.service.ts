import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EmployeesService } from '../employees/employees.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly employeesService: EmployeesService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const employee = await this.employeesService.findByEmailWithPassword(
      dto.email,
    );

    if (
      !employee ||
      !(await bcrypt.compare(dto.password, employee.passwordHash))
    ) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload: JwtPayload = {
      sub: employee.id,
      email: employee.email,
      name: employee.name,
      role: employee.role,
    };

    return { accessToken: await this.jwtService.signAsync(payload) };
  }
}
