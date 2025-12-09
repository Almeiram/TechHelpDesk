import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';
import { Client } from '../clients/entities/client.entity';
import { Category } from '../categories/entities/category.entity';
import { Technician } from '../technicians/entities/technician.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepo: Repository<Ticket>,
    @InjectRepository(Client)
    private clientsRepo: Repository<Client>,
    @InjectRepository(Category)
    private categoriesRepo: Repository<Category>,
    @InjectRepository(Technician)
    private techRepo: Repository<Technician>,
  ) {}

  async create(createTicketDto: CreateTicketDto) {
    const client = await this.clientsRepo.findOneBy({ id: createTicketDto.clientId });
    if (!client) throw new BadRequestException('Client not found');
    const category = await this.categoriesRepo.findOneBy({ id: createTicketDto.categoryId });
    if (!category) throw new BadRequestException('Category not found');
    const ticket = this.ticketsRepo.create({
      title: createTicketDto.title,
      description: createTicketDto.description,
      client,
      category,
      priority: createTicketDto.priority || 'medium',
      status: 'open',
    });
    return this.ticketsRepo.save(ticket);
  }

  findAll() {
    return this.ticketsRepo.find({ relations: ['client', 'category', 'technician'] });
  }

  findOne(id: number) {
    return this.ticketsRepo.findOne({ where: { id }, relations: ['client', 'category', 'technician'] });
  }

  async changeStatus(id: number, dto: UpdateTicketDto) {
    const ticket = await this.ticketsRepo.findOne({ where: { id }, relations: ['technician'] });
    if (!ticket) throw new NotFoundException('Ticket not found');

    const allowed = ['open', 'in_progress', 'resolved', 'closed'];
    if (dto.status && !allowed.includes(dto.status)) throw new BadRequestException('Invalid status');

    // Validate sequence
    const seq: Record<string, string> = { open: 'in_progress', in_progress: 'resolved', resolved: 'closed' };
    if (dto.status && dto.status !== ticket.status) {
      if (ticket.status === dto.status) {
        // no-op
      } else {
        const next = seq[ticket.status];
        if (next && dto.status !== next) {
          throw new BadRequestException('Invalid status transition');
        }
      }
    }

    if (dto.technicianId) {
      const tech = await this.techRepo.findOne({ where: { id: dto.technicianId }, relations: ['tickets'] });
      if (!tech) throw new BadRequestException('Technician not found');
      // count in_progress tickets
      const inProgress = (tech.tickets || []).filter((t) => t.status === 'in_progress').length;
      if (inProgress >= 5) throw new BadRequestException('Technician has too many tickets in progress');
      ticket.technician = tech;
    }

    if (dto.status) ticket.status = dto.status;
    if (dto.priority) ticket.priority = dto.priority;

    return this.ticketsRepo.save(ticket);
  }

  findByClient(clientId: number) {
    return this.ticketsRepo.find({ where: { client: { id: clientId } }, relations: ['client', 'category', 'technician'] });
  }

  findByTechnician(technicianId: number) {
    return this.ticketsRepo.find({ where: { technician: { id: technicianId } }, relations: ['client', 'category', 'technician'] });
  }
}
