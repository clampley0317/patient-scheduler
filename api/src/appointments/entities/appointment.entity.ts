import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Patient } from '../../patients/entities/patient.entity'
import { Provider } from '../../providers/entities/provider.entity'

export enum AppointmentStatus {
  Scheduled = 'scheduled',
  Cancelled = 'cancelled',
  Completed = 'completed',
}

@Index(['providerId', 'startTime'])
@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToOne(() => Patient, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'patientId' })
  patient!: Patient

  @Column()
  patientId!: string

  @ManyToOne(() => Provider, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'providerId' })
  provider!: Provider

  @Column()
  providerId!: string

  @Column({ type: 'timestamptz' })
  startTime!: Date

  @Column({ type: 'timestamptz' })
  endTime!: Date

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.Scheduled,
  })
  status!: AppointmentStatus

  @Column({ type: 'text', nullable: true })
  reason!: string | null

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date
}
