import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  firstName!: string

  @Column()
  lastName!: string

  @Column({ type: 'date' })
  dateOfBirth!: string

  @Column({ unique: true })
  email!: string

  @Column()
  phone!: string

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date
}
