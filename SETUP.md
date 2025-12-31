# Quick Setup Guide

## Option 1: Run Without Database (Quick Start)

If you just want to test the frontend with mock data:

1. Create a `.env` file in the project root:
   ```env
   DB_ENABLED=false
   PORT=3000
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_USE_MOCK_DATA=true
   ```

2. Start the frontend:
   ```bash
   npm run dev
   ```

The frontend will use mock data and the backend server is not required.

## Option 2: Run With Database (Full Setup)

### Step 1: Install PostgreSQL

**macOS (using Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Or use Docker:**
```bash
docker run --name kcssc-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=kcssc_db \
  -p 5432:5432 \
  -d postgres:15
```

### Step 2: Create Database and Tables

**Option A: Use the setup script:**
```bash
./server/db/setup.sh
```

**Option B: Manual setup:**
```bash
# Create database
createdb kcssc_db

# Run schema
psql -d kcssc_db -f server/db/schema.sql

# (Optional) Seed with sample data
psql -d kcssc_db -f server/db/seed.sql
```

### Step 3: Configure Environment Variables

Create a `.env` file in the project root:

```env
# Server
PORT=3000

# Database
DB_ENABLED=true
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kcssc_db
DB_USER=postgres
DB_PASSWORD=your_actual_password

# Frontend
VITE_API_BASE_URL=http://localhost:3000/api
VITE_USE_MOCK_DATA=false
```

**Important:** Replace `your_actual_password` with your PostgreSQL password.

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Start the Backend Server

```bash
npm run server:dev
```

You should see:
```
✅ Database connection verified
🚀 Server running on http://localhost:3000
```

### Step 6: Start the Frontend

In a new terminal:
```bash
npm run dev
```

## Troubleshooting

### "password authentication failed"

1. Check your PostgreSQL password:
   ```bash
   psql -U postgres -c "SELECT current_user;"
   ```

2. Update `.env` with the correct password

3. Or reset PostgreSQL password:
   ```bash
   # macOS with Homebrew
   psql postgres
   ALTER USER postgres PASSWORD 'newpassword';
   ```

### "database does not exist"

Create the database:
```bash
createdb kcssc_db
```

### "connection refused"

1. Check if PostgreSQL is running:
   ```bash
   # macOS
   brew services list
   
   # Or check with psql
   pg_isready
   ```

2. Start PostgreSQL if needed:
   ```bash
   brew services start postgresql@15
   ```

### Run Without Database

If you just want to test the frontend, set in `.env`:
```env
DB_ENABLED=false
VITE_USE_MOCK_DATA=true
```

The server will start but API endpoints won't work. The frontend will use mock data.

