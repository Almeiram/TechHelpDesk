import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('tickets')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @Roles('client','admin')
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(createTicketDto);
  }

  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(+id);
  }

  @Patch(':id/status')
  @Roles('technician','admin')
  changeStatus(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.changeStatus(+id, updateTicketDto);
  }

  @Get('client/:id')
  @Roles('client','admin')
  findByClient(@Param('id') id: string) {
    return this.ticketsService.findByClient(+id);
  }

  @Get('technician/:id')
  @Roles('technician','admin')
  findByTechnician(@Param('id') id: string) {
    return this.ticketsService.findByTechnician(+id);
  }
}
