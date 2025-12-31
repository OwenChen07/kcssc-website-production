# Backend Server

Express.js API server for the KCSSC website with PostgreSQL database support.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

#### Option A: PostgreSQL (Recommended)

1. Install PostgreSQL if you haven't already
2. Create a database:
   ```sql
   CREATE DATABASE kcssc_db;
   ```
3. Set environment variables (create `.env` in project root):
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=kcssc_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_SSL=false
   PORT=3000
   ```

4. Run the schema:
   ```bash
   psql -U postgres -d kcssc_db -f server/db/schema.sql
   ```

5. (Optional) Seed with sample data:
   ```bash
   psql -U postgres -d kcssc_db -f server/db/seed.sql
   ```

#### Option B: Docker PostgreSQL

```bash
docker run --name kcssc-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=kcssc_db \
  -p 5432:5432 \
  -d postgres:15

# Then run schema
psql -h localhost -U postgres -d kcssc_db -f server/db/schema.sql
```

### 3. Run the Server

**Development mode (with auto-reload):**
```bash
npm run server:dev
```

**Production mode:**
```bash
npm run server:build
npm run server:start:prod
```

The server will start on `http://localhost:3000`

## API Endpoints

### Events

- `GET /api/events` - Get all events
  - Query params: `category`, `startDate`, `endDate`, `featured`
- `GET /api/events/:id` - Get event by ID

### Programs

- `GET /api/programs` - Get all programs
  - Query params: `category`, `ageGroup`
- `GET /api/programs/:id` - Get program by ID

### Health Check

- `GET /health` - Server health status

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `kcssc_db` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` |
| `DB_SSL` | Enable SSL connection | `false` |

## Project Structure

```
server/
├── db/
│   ├── connection.ts    # Database connection pool
│   ├── schema.sql       # Database schema
│   └── seed.sql         # Sample data
├── routes/
│   ├── events.ts        # Events API routes
│   └── programs.ts      # Programs API routes
├── index.ts             # Main server file
├── tsconfig.json        # TypeScript config
└── README.md            # This file
```

## Development

The server uses `tsx` for running TypeScript directly without compilation. In development mode, it watches for file changes and automatically restarts.

## Production

For production, compile TypeScript to JavaScript:

```bash
npm run server:build
npm run server:start:prod
```

## Troubleshooting

### Database Connection Issues

1. Check PostgreSQL is running: `pg_isready`
2. Verify credentials in `.env` file
3. Check firewall/network settings
4. Ensure database exists: `psql -U postgres -l`

### Port Already in Use

Change the `PORT` environment variable or kill the process using port 3000:
```bash
lsof -ti:3000 | xargs kill
```


