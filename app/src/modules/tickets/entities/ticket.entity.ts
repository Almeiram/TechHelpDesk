import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Client } from '../../clients/entities/client.entity';
import { Technician } from '../../technicians/entities/technician.entity';

@Entity()
export class Ticket {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ default: 'open' })
    status: 'open' | 'in_progress' | 'resolved' | 'closed';

    @Column({ default: 'medium' })
    priority: 'low' | 'medium' | 'high';

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Category, (c) => c.tickets)
    category: Category;

    @ManyToOne(() => Client, (c) => c.tickets)
    client: Client;

    @ManyToOne(() => Technician, (t) => t.tickets, { nullable: true })
    technician: Technician;

    // @ManyToOne(() => Client, (c) => c.tickets)
    // client: Client;

    // @ManyToOne(() => Technician, (t) => t.tickets, { nullable: true })
    // technician: Technician;
}
