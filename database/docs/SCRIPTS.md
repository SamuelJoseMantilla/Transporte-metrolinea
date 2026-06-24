# MetroLinea - Scripts

## init_db.py
Initialize database tables.

```bash
cd database
python scripts/init_db.py
```

Requires `asyncpg` package: `pip install asyncpg`

## seed.py
Insert seed data (4 routes, 19 stops, 10 buses).

```bash
cd database
python seeders/seed.py
```

## schema.sql
Full SQL schema (CREATE DATABASE, CREATE TABLE, indexes).

```bash
psql -h localhost -U metrolinea -f schema.sql
```

## seed.sql
SQL seed data.

```bash
psql -h localhost -U metrolinea -d metrolinea_db -f seed.sql
```
