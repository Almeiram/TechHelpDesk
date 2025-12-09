import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { Technician } from '../../technicians/entities/technician.entity';

export type UserRole = 'admin' | 'technician' | 'client';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({ unique: true })
	email: string;

	@Column()
	password: string;

	@Column({ default: 'client' })
	role: UserRole;

	@OneToOne(() => Client, (c) => c.user, { nullable: true })
	client?: Client;

	@OneToOne(() => Technician, (t) => t.user, { nullable: true })
	technician?: Technician;
}
