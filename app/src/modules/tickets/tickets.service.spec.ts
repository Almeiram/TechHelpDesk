import { newDb } from 'pg-mem';
import { DataSource } from 'typeorm';
import { TicketsService } from './tickets.service';
import { Ticket } from './entities/ticket.entity';
import { Client } from '../clients/entities/client.entity';
import { Technician } from '../technicians/entities/technician.entity';
import { Category } from '../categories/entities/category.entity';

describe('TicketsService (integration with pg-mem)', () => {
  let dataSource: DataSource;
  let service: TicketsService;

  beforeAll(async () => {
    const db = newDb();
    // pg-mem does not implement the version() function used by TypeORM's PG driver
  (db.public as any).registerFunction({ name: 'version', returns: 'text', implementation: () => 'pg-mem' });
  (db.public as any).registerFunction({ name: 'current_database', returns: 'text', implementation: () => 'pg_mem' });
    dataSource = await db.adapters.createTypeormDataSource({
      type: 'postgres',
      entities: [Ticket, Client, Technician, Category, require('../users/entities/user.entity').User],
      synchronize: true,
    });
    await dataSource.initialize();

    // create repos
    const ticketRepo = dataSource.getRepository(Ticket);
    const clientRepo = dataSource.getRepository(Client);
    const techRepo = dataSource.getRepository(Technician);
    const categoryRepo = dataSource.getRepository(Category);

    service = new TicketsService(ticketRepo, clientRepo, categoryRepo, techRepo);
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) await dataSource.destroy();
  });

  test('should create a ticket', async () => {
    const clientRepo = dataSource.getRepository(Client);
    const catRepo = dataSource.getRepository(Category);
    const client = clientRepo.create({ name: 'Test', company: 'X', contactEmail: 'a@x.com' });
    await clientRepo.save(client);
    const cat = catRepo.create({ title: 'Solicitud', description: 'desc', status: 'open' });
    await catRepo.save(cat);

    const dto: any = { title: 'Help', description: 'Help me', clientId: client.id, categoryId: cat.id, priority: 'low' };
    const ticket = await service.create(dto);
    expect(ticket).toHaveProperty('id');
    expect(ticket.title).toBe('Help');
    expect(ticket.client.id).toBe(client.id);
  });

  test('should change status following the sequence and validate technician limit', async () => {
    const clientRepo = dataSource.getRepository(Client);
    const catRepo = dataSource.getRepository(Category);
    const techRepo = dataSource.getRepository(Technician);

    const client = clientRepo.create({ name: 'Test2', company: 'Y', contactEmail: 'b@y.com' });
    await clientRepo.save(client);
    const cat = catRepo.create({ title: 'Hardware', description: 'hw', status: 'open' });
    await catRepo.save(cat);
    const tech = techRepo.create({ name: 'T1', specialty: 'S', availability: true });
    await techRepo.save(tech);

    // create 1 ticket
    const t = await service.create({ title: 'T', description: 'D', clientId: client.id, categoryId: cat.id });

    // assign technician and move to in_progress
    const updated = await service.changeStatus(t.id, { technicianId: tech.id, status: 'in_progress' });
    expect(updated.status).toBe('in_progress');
    expect(updated.technician.id).toBe(tech.id);

    // try invalid transition: open -> resolved
    const t2 = await service.create({ title: 'T2', description: 'D2', clientId: client.id, categoryId: cat.id });
    await expect(service.changeStatus(t2.id, { status: 'resolved' })).rejects.toBeDefined();

  // create 5 tickets and set them in_progress for the technician to reach limit
  const tickets: any[] = [];
    for (let i = 0; i < 4; i++) {
      const tk = await service.create({ title: `TT${i}`, description: 'd', clientId: client.id, categoryId: cat.id });
      tickets.push(tk);
      await service.changeStatus(tk.id, { technicianId: tech.id, status: 'in_progress' });
    }

    // Now tech has 5 in_progress (including first). Next assignment should fail
    const tNext = await service.create({ title: 'Overflow', description: 'd', clientId: client.id, categoryId: cat.id });
    await expect(service.changeStatus(tNext.id, { technicianId: tech.id, status: 'in_progress' })).rejects.toBeDefined();
  });
});
