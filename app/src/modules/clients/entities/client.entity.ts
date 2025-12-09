import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Client {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	company: string;

	@Column()
	contactEmail: string;

	@OneToMany(() => Ticket, (t) => t.client)
	tickets: Ticket[];

	@OneToOne(() => User, (u) => u.client)
	user?: User;
}
