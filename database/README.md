# Database

This directory contains database-related files including schemas, migrations, and seed data.

## Structure

```
database/
├── migrations/    # Database migration files
├── seeds/         # Seed data for development/testing
├── schemas/       # Database schema definitions
└── README.md      # This file
```

## Folder Descriptions

### `/migrations`
Database migration files for version control of database schema changes.

Migrations should be:
- **Reversible**: Include both up and down migrations
- **Incremental**: Small, focused changes
- **Timestamped**: Named with timestamps for ordering
- **Tested**: Verified on a development database first

**Naming Convention:**
```
YYYYMMDDHHMMSS_description.sql
```

**Example:**
- `20260119000001_create_medicines_table.sql`
- `20260119000002_create_pharmacies_table.sql`
- `20260119000003_add_medicine_pharmacy_relation.sql`

### `/seeds`
Seed data files for populating the database with initial or test data.

**Example:**
- `development_seeds.sql` - Development environment data
- `test_seeds.sql` - Test environment data
- `production_seeds.sql` - Initial production data (if any)

### `/schemas`
Database schema definitions and documentation.

**Example:**
- `schema.sql` - Complete database schema
- `schema_diagram.png` - Visual representation of database schema
- `schema_documentation.md` - Detailed schema documentation

## Database Design Principles

### Naming Conventions

- **Tables**: Plural, lowercase, snake_case (e.g., `medicines`, `pharmacy_medicines`)
- **Columns**: Lowercase, snake_case (e.g., `medicine_name`, `created_at`)
- **Primary Keys**: `id` (or `table_name_id` for junction tables)
- **Foreign Keys**: `referenced_table_id` (e.g., `pharmacy_id`)
- **Indexes**: `idx_table_column` (e.g., `idx_medicines_name`)

### Schema Design Guidelines

1. **Normalization**: Aim for 3rd Normal Form (3NF)
2. **Primary Keys**: Every table should have a primary key
3. **Foreign Keys**: Use foreign key constraints for referential integrity
4. **Indexes**: Add indexes on frequently queried columns
5. **Timestamps**: Include `created_at` and `updated_at` columns
6. **Soft Deletes**: Consider `deleted_at` for soft delete functionality

## Example Schema

### Core Tables

#### medicines
Stores information about medicines/drugs.

```sql
CREATE TABLE medicines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    brand_name VARCHAR(255),
    dosage VARCHAR(100),
    form VARCHAR(50), -- tablet, capsule, syrup, etc.
    manufacturer VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_medicines_name ON medicines(name);
CREATE INDEX idx_medicines_generic_name ON medicines(generic_name);
```

#### pharmacies
Stores information about pharmacies/drugstores.

```sql
CREATE TABLE pharmacies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100),
    district VARCHAR(100),
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone VARCHAR(20),
    email VARCHAR(255),
    opening_hours JSONB,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_pharmacies_city ON pharmacies(city);
CREATE INDEX idx_pharmacies_location ON pharmacies(latitude, longitude);
```

#### pharmacy_medicines
Junction table linking pharmacies to medicines with availability info.

```sql
CREATE TABLE pharmacy_medicines (
    id SERIAL PRIMARY KEY,
    pharmacy_id INTEGER NOT NULL REFERENCES pharmacies(id),
    medicine_id INTEGER NOT NULL REFERENCES medicines(id),
    quantity INTEGER DEFAULT 0,
    price DECIMAL(10, 2),
    is_available BOOLEAN DEFAULT FALSE,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(pharmacy_id, medicine_id)
);

CREATE INDEX idx_pharmacy_medicines_pharmacy ON pharmacy_medicines(pharmacy_id);
CREATE INDEX idx_pharmacy_medicines_medicine ON pharmacy_medicines(medicine_id);
CREATE INDEX idx_pharmacy_medicines_available ON pharmacy_medicines(is_available);
```

#### users
Stores user account information.

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'customer', -- customer, pharmacy, admin
    pharmacy_id INTEGER REFERENCES pharmacies(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

## Migration Best Practices

1. **Never modify existing migrations**: Create new migrations for changes
2. **Test migrations**: Test on a copy of production data
3. **Backup before migration**: Always backup before running migrations in production
4. **Version control**: Keep migrations in version control
5. **Document complex changes**: Add comments for non-obvious changes

## Running Migrations

*Instructions will be added based on chosen database tool/ORM*

Example with common tools:
```bash
# Sequelize
npx sequelize-cli db:migrate

# Knex
npx knex migrate:latest

# Flyway
flyway migrate

# Django
python manage.py migrate
```

## Seeding the Database

```bash
# Example commands (to be updated based on tech stack)
npm run db:seed
```

## Database Backup and Restore

```bash
# PostgreSQL backup
pg_dump -U username -d database_name > backup.sql

# PostgreSQL restore
psql -U username -d database_name < backup.sql

# MySQL backup
mysqldump -u username -p database_name > backup.sql

# MySQL restore
mysql -u username -p database_name < backup.sql
```

## Environment Configuration

Configure database connections using environment variables:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=medicine_tracker
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=false
```

## Performance Optimization

- Use appropriate indexes
- Implement query optimization
- Consider read replicas for high traffic
- Use connection pooling
- Monitor slow queries
- Regular maintenance (VACUUM, ANALYZE for PostgreSQL)

## Security

- Use parameterized queries to prevent SQL injection
- Implement proper access controls
- Encrypt sensitive data
- Regular security audits
- Keep database software updated
- Use strong passwords
- Limit database access to necessary services only
