"""Initialize database tables using raw SQL from schema.sql."""
import os
import asyncio
import asyncpg

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "5432"))
DB_USER = os.getenv("DB_USER", "metrolinea")
DB_PASSWORD = os.getenv("DB_PASSWORD", "metrolinea_secret")
DB_NAME = os.getenv("DB_NAME", "metrolinea_db")

SCHEMA_FILE = os.path.join(os.path.dirname(__file__), "..", "schema.sql")


async def init_db():
    print(f"Connecting to PostgreSQL at {DB_HOST}:{DB_PORT}...")

    conn = await asyncpg.connect(
        user="postgres",
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT,
        database="postgres",
    )

    try:
        exists = await conn.fetchval(
            "SELECT 1 FROM pg_database WHERE datname = $1", DB_NAME
        )
        if not exists:
            print(f"Creating database '{DB_NAME}'...")
            await conn.execute(f'CREATE DATABASE "{DB_NAME}"')
        else:
            print(f"Database '{DB_NAME}' already exists.")
    finally:
        await conn.close()

    conn = await asyncpg.connect(
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
    )

    try:
        with open(SCHEMA_FILE, "r") as f:
            sql = f.read()
        print("Applying schema.sql...")
        await conn.execute(sql)
        print("Schema applied successfully.")
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(init_db())
