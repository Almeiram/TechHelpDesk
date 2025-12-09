import { IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketDto {
	@ApiProperty({ example: 'PC no enciende', description: 'Título corto del ticket' })
	@IsNotEmpty()
	title: string;

	@ApiProperty({ example: 'Al presionar el botón de encendido la PC no responde ni hace ruido', description: 'Descripción detallada del problema' })
	@IsNotEmpty()
	description: string;

	@ApiProperty({ example: 1, description: 'ID del cliente que reporta el ticket' })
	@IsNotEmpty()
	@IsNumber()
	clientId: number;

	@ApiProperty({ example: 2, description: 'ID de la categoría a la que pertenece el ticket', required: false })
	@IsNumber()
	categoryId: number;

	@ApiProperty({ example: 'high', enum: ['low', 'medium', 'high'], description: 'Prioridad del ticket', required: false })
	@IsEnum(['low', 'medium', 'high'])
	priority?: 'low' | 'medium' | 'high';
}
