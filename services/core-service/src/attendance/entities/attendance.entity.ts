import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';

@Entity('attendance')
@Unique(['employeeId', 'date'])
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  employeeId: string;

  @ManyToOne(() => Employee, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'employeeId' })
  employee?: Employee;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'timestamptz' })
  clockInAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  clockOutAt: Date | null;
}
