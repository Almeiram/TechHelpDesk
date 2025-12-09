# TechHelpDesk

Author: Maria Almeira
Clan: tayrona

This is a ticket management system that provides technical support services for organizations that manage multiple work teams.

## Why is this important?

Because support requests (tickets) are currently logged manually using spreadsheets, which leads to delays in service, loss of traceability, and duplicate reports.

## Technologies used

* Node.js
* Nest.js
* Docker
* PostgreSQL
* TypeORM
* dotenv

## Installation and execution

Clone the repository:

`git clone https://github.com/Almeiram/TechHelpDesk.git`

Install dependencies:

```
npm install
```

Create and configure the `.env` file:

# Node.js App
APP_CONTAINER_NAME=name_app
APP_PORT=port
NODE_ENV=development
APP_CPU_LIMIT=0.50
APP_MEM_LIMIT=512M

# PostgreSQL
DB_CONTAINER_NAME=name_container
POSTGRES_HOST=db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=name_database
POSTGRES_PORT=5432
POSTGRES_LOCAL=5435
DB_CPU_LIMIT=0.50
DB_MEM_LIMIT=512M

JWT_SECRET=yourfullSecret

## Start the application using Docker

```
docker compose up -d --build
```

The server will be available at:

http://localhost:3000

## Relationships

    ** 1 customer → N many transactions **
    ** 1 transaction → N Many invoices **

## API Endpoints Documentation

All API requests use the base URL exposed by Swagger (see /api/docs)

Example response (200):

```json
{
  "id_prestamo": 14,
  "fecha_prestamo": "2025-06-08T05:00:00.000Z",
  "fecha_devolucion": "2025-08-12T05:00:00.000Z",
  "estado": "activo",
  "usuario": "Helena Micaela Alvarado",
  "isbn": "978-1-968004-87-3",
  "libro": "Modi beatae"
}
```

Example: POST route description (creates a resource)

Request body example:

```json
{
  "fecha_prestamo": "2025-06-08",
  "fecha_devolucion": "2025-08-12",
  "estado": "activo",
  "usuario": "Helena Micaela Alvarado",
  "isbn": "978-1-968004-87-3",
  "libro": "Modi beatae"
}
```

Example response (200):

```json
{
  "mensaje": "customer creado exitosamente"
}
```

Example: PUT /customers/31

Request body example:

```json
{
  "fecha_prestamo": "2025-06-08",
  "fecha_devolucion": "2025-08-12",
  "estado": "entregado",
  "usuario": "Helena Micaela Alvarado",
  "isbn": "978-1-968004-87-3",
  "libro": "Modi beatae"
}
```

Example response (200):

```json
{
  "mensaje": "transaction update"
}
```

Example: DELETE /customers/31

Example response (200):

```json
{
  "mensaje": "transaction delete"
}
```

## Unit test examples (Jest)

Here are two minimal examples to write unit tests using Jest in this NestJS project.

- Service test (e.g. `TicketsService`) — create a ticket and verify properties:

```ts
import { TicketsService } from './tickets.service';
// ...imports for entities and creating mock repositories

describe('TicketsService - unit', () => {
  let service: TicketsService;

  beforeEach(() => {
    const ticketRepo = { save: jest.fn(), findOne: jest.fn() };
    const clientRepo = { findOne: jest.fn() };
    const categoryRepo = { findOne: jest.fn() };
    const techRepo = { findOne: jest.fn() };
    service = new TicketsService(ticketRepo as any, clientRepo as any, categoryRepo as any, techRepo as any);
  });

  it('should create a ticket with default status open', async () => {
    const dto: any = { title: 'T', description: 'D', clientId: 1, categoryId: 1 };
    // mock client/category exist
    (service as any).clientRepo = { findOne: async () => ({ id: 1 }) };
    (service as any).categoryRepo = { findOne: async () => ({ id: 1 }) };
    const created = await service.create(dto);
    expect(created).toBeDefined();
    expect(created.status).toBe('open');
  });
});
```

- Controller test (e.g. `AuthController`) — mount the TestingModule with a mocked `AuthService`:

```ts
import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  const mockAuthService = { login: jest.fn().mockResolvedValue({ access_token: 'tok' }) };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: 'AuthService', useValue: mockAuthService }],
    }).compile();
    controller = module.get(AuthController);
  });

  it('login should return token', async () => {
    await expect(controller.login({ email: 'a', password: 'b' } as any)).resolves.toEqual({ access_token: 'tok' });
  });
});
```

> Note: in real tests use `getRepositoryToken(Entity)` to mock TypeORM repositories in the TestingModule and preferably `pg-mem` for in-memory integration tests.

## Endpoint examples (updated)

Below are three examples with `curl` that reflect the current endpoints used in this project.

1) POST /auth/login — obtain token

```bash
curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"client@tech.com","password":"password"}'
```

Example response:

```json
{
  "success": true,
  "data": { "access_token": "<JWT_TOKEN>" },
  "message": null
}
```

2) POST /auth/register — register a new user

```bash
curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"t@test.com","password":"pass","role":"client"}'
```

Example response: created user object and token under `data`.

3) POST /tickets — create a ticket (requires token of user with role `client` or `admin`)

```bash
TOKEN="<your_jwt_here>" # get with /auth/login
curl -v -X POST http://localhost:3000/tickets \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My PC won't start","description":"No power when pressing the button","clientId":1,"categoryId":1,"priority":"high"}'
```

Example response:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "My PC won't start",
    "description": "No power when pressing the button",
    "status": "open",
    "priority": "high",
    "client": { /* client object */ },
    "category": { /* category object */ }
  },
  "message": null
}
```