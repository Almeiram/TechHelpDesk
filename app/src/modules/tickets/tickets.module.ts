import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Ticket } from './entities/ticket.entity';
import { Client } from '../clients/entities/client.entity';
import { Category } from '../categories/entities/category.entity';
import { Technician } from '../technicians/entities/technician.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Client, Category, Technician])],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
