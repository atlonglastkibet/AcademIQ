# """Load CSV files from `database/data` into a Postgres database.

# Usage (recommended): create a `.env` with DB_URL or set `DATABASE_URL` env var.

# The script discovers CSV files in `database/data` and uploads them as tables named after the file (without extension).
# It uses pandas + SQLAlchemy and will try to infer dtypes. For large files, it uses chunked uploads.
# """

# import os
# import sys
# from pathlib import Path
# import logging
# import argparse

# import pandas as pd
# from sqlalchemy import create_engine, text
# from sqlalchemy.engine import URL

# logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
# logger = logging.getLogger(__name__)

# DATA_DIR = Path(__file__).resolve().parent / "data"
# CHUNK_SIZE = 20000


# def get_database_url(env_var: str = "DATABASE_URL") -> str:
#     url = os.environ.get(env_var)
#     if url:
#         return url
#     # Fallback to common Heroku-style URL name
#     url = os.environ.get("DB_URL")
#     if url:
#         return url
#     raise RuntimeError("No database URL found. Set DATABASE_URL or DB_URL environment variable or pass --db-url")


# def list_csv_files(data_dir: Path) -> list:
#     return sorted([p for p in data_dir.glob("*.csv")])


# def table_name_from_path(p: Path) -> str:
#     return p.stem


# def upload_csv(engine, csv_path: Path, table_name: str, if_exists: str = "replace"):
#     """Upload a CSV to Postgres using pandas.to_sql with chunking."""
#     logger.info(f"Uploading {csv_path.name} -> {table_name} (if_exists={if_exists})")
#     total = 0
#     for chunk in pd.read_csv(csv_path, chunksize=CHUNK_SIZE):
#         # Quick dtype cleanups: convert NaN-only columns to object
#         # (pandas infers dtype but SQLAlchemy may fail on all-NaN columns)
#         try:
#             chunk.to_sql(table_name, engine, if_exists=if_exists if total == 0 else "append", index=False, method="multi")
#             total += len(chunk)
#             logger.info(f"  wrote {total} rows so far")
#         except Exception as e:
#             logger.exception(f"Failed writing chunk to {table_name}: {e}")
#             raise


# def ensure_db(engine):
#     with engine.connect() as conn:
#         conn.execute(text("SELECT 1"))


# def main():
#     parser = argparse.ArgumentParser(description="Load CSVs from database/data into Postgres")
#     parser.add_argument("--db-url", help="Database URL (overrides env)")
#     parser.add_argument("--data-dir", default=str(DATA_DIR), help="Directory with CSV files")
#     parser.add_argument("--skip", nargs="*", default=[], help="List of CSV filenames to skip")
#     parser.add_argument("--if-exists", choices=["replace", "append", "fail"], default="replace")

#     args = parser.parse_args()

#     db_url = args.db_url or os.environ.get("DATABASE_URL") or os.environ.get("DB_URL")
#     if not db_url:
#         logger.error("Database URL not provided. Set DATABASE_URL env var or pass --db-url")
#         sys.exit(2)

#     engine = create_engine(db_url)
#     try:
#         ensure_db(engine)
#     except Exception as e:
#         logger.exception("Cannot connect to database. Check credentials and network")
#         sys.exit(3)

#     data_dir = Path(args.data_dir)
#     if not data_dir.exists():
#         logger.error(f"Data directory not found: {data_dir}")
#         sys.exit(4)

#     csv_files = list_csv_files(data_dir)
#     if not csv_files:
#         logger.error(f"No CSV files found in {data_dir}")
#         sys.exit(5)

#     for p in csv_files:
#         if p.name in args.skip:
#             logger.info(f"Skipping {p.name}")
#             continue
#         table = table_name_from_path(p)
#         upload_csv(engine, p, table, if_exists=args.if_exists)

#     logger.info("All done")


# if __name__ == "__main__":
#     main()
"""Load CSV files from `database/data` into a Postgres database.

Usage (recommended): create a `.env` with DB_URL or set `DATABASE_URL` env var.

The script discovers CSV files in `database/data` and uploads them as tables named after the file (without extension).
It uses pandas + SQLAlchemy and will try to infer dtypes. For large files, it uses chunked uploads.
"""

import os
import sys
from pathlib import Path
import logging
import argparse

import pandas as pd
from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

DATA_DIR = Path(__file__).resolve().parent / "data"
CHUNK_SIZE = 20000


def get_database_url(env_var: str = "DATABASE_URL") -> str:
    url = os.environ.get(env_var)
    if url:
        return url
    # Fallback to common Heroku-style URL name
    url = os.environ.get("DB_URL")
    if url:
        return url
    raise RuntimeError("No database URL found. Set DATABASE_URL or DB_URL environment variable or pass --db-url")


def list_csv_files(data_dir: Path) -> list:
    return sorted([p for p in data_dir.glob("*.csv")])


def table_name_from_path(p: Path) -> str:
    return p.stem


def upload_csv(engine, csv_path: Path, table_name: str, if_exists: str = "replace"):
    """Upload a CSV to Postgres using pandas.to_sql with chunking."""
    logger.info(f"Uploading {csv_path.name} -> {table_name} (if_exists={if_exists})")
    total = 0
    for chunk in pd.read_csv(csv_path, chunksize=CHUNK_SIZE):
        # Quick dtype cleanups: convert NaN-only columns to object
        # (pandas infers dtype but SQLAlchemy may fail on all-NaN columns)
        try:
            chunk.to_sql(
                table_name,
                engine,
                if_exists=if_exists if total == 0 else "append",
                index=False,
                method="multi",
            )
            total += len(chunk)
            logger.info(f"  wrote {total} rows so far")
        except Exception as e:
            logger.exception(f"Failed writing chunk to {table_name}: {e}")
            raise


def ensure_db(engine):
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))


def build_engine(db_url: str):
    """Build SQLAlchemy engine with sslmode=require for Supabase."""
    url = make_url(db_url)

    # Ensure sslmode=require
    if "sslmode" not in url.query:
        url = url.set(query={**url.query, "sslmode": "require"})

    return create_engine(url)


def main():
    parser = argparse.ArgumentParser(description="Load CSVs from database/data into Postgres")
    parser.add_argument("--db-url", help="Database URL (overrides env)")
    parser.add_argument("--data-dir", default=str(DATA_DIR), help="Directory with CSV files")
    parser.add_argument("--skip", nargs="*", default=[], help="List of CSV filenames to skip")
    parser.add_argument("--if-exists", choices=["replace", "append", "fail"], default="replace")

    args = parser.parse_args()

    db_url = args.db_url or os.environ.get("DATABASE_URL") or os.environ.get("DB_URL")
    if not db_url:
        logger.error("Database URL not provided. Set DATABASE_URL env var or pass --db-url")
        sys.exit(2)

    engine = build_engine(db_url)
    try:
        ensure_db(engine)
    except Exception as e:
        logger.exception("Cannot connect to database. Check credentials and network")
        sys.exit(3)

    data_dir = Path(args.data_dir)
    if not data_dir.exists():
        logger.error(f"Data directory not found: {data_dir}")
        sys.exit(4)

    csv_files = list_csv_files(data_dir)
    if not csv_files:
        logger.error(f"No CSV files found in {data_dir}")
        sys.exit(5)

    for p in csv_files:
        if p.name in args.skip:
            logger.info(f"Skipping {p.name}")
            continue
        table = table_name_from_path(p)
        upload_csv(engine, p, table, if_exists=args.if_exists)

    logger.info("All done")


if __name__ == "__main__":
    main()