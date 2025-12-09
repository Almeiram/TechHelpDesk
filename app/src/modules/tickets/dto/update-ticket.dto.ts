import { IsEnum, IsOptional, IsNumber } from 'class-validator';

export class UpdateTicketDto {
  @IsOptional()
  @IsEnum(['open', 'in_progress', 'resolved', 'closed'])
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';

  @IsOptional()
  @IsNumber()
  technicianId?: number;

  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  priority?: 'low' | 'medium' | 'high';
}
// kept custom UpdateTicketDto above
