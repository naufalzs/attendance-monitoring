import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '../role.enum';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'Naufal Zufar' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'naufalzs@company.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'Fullstack Developer' })
  @IsString()
  @IsNotEmpty()
  position: string;

  @ApiProperty({ example: '081234567890' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ enum: Role, default: Role.EMPLOYEE })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
