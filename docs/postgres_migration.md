# Migrate CSV data to Postgres and deploy to free-tier hosted Postgres

This guide explains how to load the CSV files in `database/data` into a Postgres database and how to get a free hosted Postgres (Supabase, ElephantSQL).

## Steps

1. Create or get a Postgres DB
   - Supabase (https://supabase.com) offers a free-tier Postgres database. Create a project and find the Database connection string.
   - ElephantSQL (https://www.elephantsql.com) also provides free plans.

2. Create a `.env` file
   - Copy `database/.env.example` to `database/.env` and paste your `DATABASE_URL`.

3. Install dependencies (recommended inside a venv)

   python -m venv .venv
   source .venv/bin/activate
   pip install -r database/requirements.txt

4. Run the loader
   - From the project root run:

   python database/load_csvs_to_postgres.py --db-url "$DATABASE_URL"

   or, if you added `.env` with DATABASE_URL set in your shell environment, just:

   python database/load_csvs_to_postgres.py

5. Notes and tips
   - The script uploads each CSV as a table named after the file (without extension).
   - By default it replaces existing tables; use `--if-exists append` to append.
   - For very large files or network-limited hosts consider using the hosted DB's bulk import (like Supabase's CSV import in the UI) or `pg_copy`/`psql` copy commands.

## Security
- Do not commit `.env` with real credentials.
- Rotate credentials if accidentally leaked.
