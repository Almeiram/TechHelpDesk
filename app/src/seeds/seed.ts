import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../modules/users/entities/user.entity';
import { Client } from '../modules/clients/entities/client.entity';
import { Technician } from '../modules/technicians/entities/technician.entity';
import { Category } from '../modules/categories/entities/category.entity';
import { Ticket } from '../modules/tickets/entities/ticket.entity';

async function run() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: +(process.env.DB_PORT || 5432),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'techhelpdesk',
    synchronize: true,
    entities: [User, Client, Technician, Category, Ticket],
  });

  await dataSource.initialize();
  console.log('DB connected for seeding');

  const userRepo = dataSource.getRepository(User);
  const clientRepo = dataSource.getRepository(Client);
  const techRepo = dataSource.getRepository(Technician);
  const categoryRepo = dataSource.getRepository(Category);
  const ticketRepo = dataSource.getRepository(Ticket);

  // Clean (delete in safe order to respect FK constraints)
  await ticketRepo.createQueryBuilder().delete().execute();
  await categoryRepo.createQueryBuilder().delete().execute();
  await clientRepo.createQueryBuilder().delete().execute();
  await techRepo.createQueryBuilder().delete().execute();
  await userRepo.createQueryBuilder().delete().execute();

  // Users
  const admin = userRepo.create({ name: 'Admin', email: 'admin@tech.com', password: '123456789', role: 'admin' });
  const tech = userRepo.create({ name: 'Tech', email: 'tech@tech.com', password: await bcrypt.hash('password', 10), role: 'technician' });
  const clientUser = userRepo.create({ name: 'Client', email: 'client@tech.com', password: await bcrypt.hash('password', 10), role: 'client' });

  await userRepo.save([admin, tech, clientUser]);

  // Client and Technician profiles
  const client = clientRepo.create({ name: 'TECNIGLASS', company: 'TECNIGLASS', contactEmail: 'contact@tecniglass.com' });
  await clientRepo.save(client);

  const technician = techRepo.create({ name: 'Juan mecanico', specialty: 'Networks', availability: true });
  await techRepo.save(technician);

  // Categories
  const c1 = categoryRepo.create({ title: 'Solicitud', description: 'Solicitud general', status: 'open' });
  const c2 = categoryRepo.create({ title: 'Hardware', description: 'se le quemo el computador', status: 'open' });
  const c3 = categoryRepo.create({ title: 'Software', description: 'se le cerro el programa', status: 'open' });
  await categoryRepo.save([c1, c2, c3]);

  // Some tickets
  const t1 = ticketRepo.create({ title: 'PC no enciende', description: 'La pantalla no muestra señal', status: 'open', priority: 'high', client, category: c2 });
  const t2 = ticketRepo.create({ title: 'Instalar el paquete de office', description: 'Necesitamos Office', status: 'open', priority: 'medium', client, category: c3 });
  await ticketRepo.save([t1, t2]);

  console.log('Seeding completed');
  await dataSource.destroy();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
