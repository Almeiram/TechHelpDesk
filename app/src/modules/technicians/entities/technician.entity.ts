import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Technician {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	specialty: string;

	@Column({ default: true })
	availability: boolean;

	@OneToMany(() => Ticket, (t) => t.technician)
	tickets: Ticket[];

	@OneToOne(() => User, (u) => u.technician)
	user?: User;
}
