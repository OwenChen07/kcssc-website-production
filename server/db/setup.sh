#!/bin/bash
# Database setup script for KCSSC website

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up KCSSC database...${NC}"

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}Error: psql is not installed. Please install PostgreSQL.${NC}"
    exit 1
fi

# Get database connection details
read -p "Database host [localhost]: " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Database port [5432]: " DB_PORT
DB_PORT=${DB_PORT:-5432}

read -p "Database name [kcssc_db]: " DB_NAME
DB_NAME=${DB_NAME:-kcssc_db}

read -p "Database user [postgres]: " DB_USER
DB_USER=${DB_USER:-postgres}

read -sp "Database password: " DB_PASSWORD
echo

# Create database if it doesn't exist
echo -e "${BLUE}Creating database if it doesn't exist...${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || echo "Database may already exist"

# Run schema
echo -e "${BLUE}Running schema...${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$(dirname "$0")/schema.sql"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Schema applied successfully${NC}"
else
    echo -e "${RED}❌ Error applying schema${NC}"
    exit 1
fi

# Ask if user wants to seed data
read -p "Do you want to seed the database with sample data? (y/n): " SEED_DATA
if [[ $SEED_DATA == "y" || $SEED_DATA == "Y" ]]; then
    echo -e "${BLUE}Seeding database...${NC}"
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$(dirname "$0")/seed.sql"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database seeded successfully${NC}"
    else
        echo -e "${RED}❌ Error seeding database${NC}"
    fi
fi

echo -e "${GREEN}✅ Database setup complete!${NC}"
echo -e "${BLUE}Update your .env file with these credentials:${NC}"
echo "DB_HOST=$DB_HOST"
echo "DB_PORT=$DB_PORT"
echo "DB_NAME=$DB_NAME"
echo "DB_USER=$DB_USER"
echo "DB_PASSWORD=$DB_PASSWORD"


