import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Ticket } from '../../tickets/entities/ticket.entity';

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: 'open' | 'in_progress' | 'closed';

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // @ManyToOne(() => Client, (c) => c.tickets)
    // client: Client;

    // @ManyToOne(() => Technician, (t) => t.tickets, { nullable: true })
    // technician: Technician;

    @OneToMany(() => Ticket, (t) => t.category)
    tickets: Ticket[];
}