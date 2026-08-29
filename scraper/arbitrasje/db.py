"""SQLite: historikk over observasjoner/funn og HTTP-cache (6 t TTL)."""

import sqlite3
import time

from .models import Deal, FinnListing, ShopOffer

CACHE_TTL_S = 6 * 3600

_SCHEMA = """
CREATE TABLE IF NOT EXISTS runs (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  started_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS shop_offers (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id    INTEGER NOT NULL REFERENCES runs(id),
  shop      TEXT NOT NULL,
  sku       TEXT NOT NULL,
  title     TEXT NOT NULL,
  model     TEXT,
  ean       TEXT,
  price_nok REAL NOT NULL,
  url       TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS finn_listings (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id         INTEGER NOT NULL REFERENCES runs(id),
  ad_id          TEXT NOT NULL,
  title          TEXT NOT NULL,
  price_nok      REAL NOT NULL,
  condition      TEXT,
  private_seller INTEGER,
  url            TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS deals (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id      INTEGER NOT NULL REFERENCES runs(id),
  shop        TEXT NOT NULL,
  title       TEXT NOT NULL,
  shop_price  REAL NOT NULL,
  finn_p25    REAL,
  n_listings  INTEGER NOT NULL,
  gevinst     REAL,
  pct         REAL,
  note        TEXT
);

CREATE TABLE IF NOT EXISTS http_cache (
  url        TEXT PRIMARY KEY,
  body       TEXT NOT NULL,
  fetched_at REAL NOT NULL
);
"""


def open_db(path: str) -> sqlite3.Connection:
    db = sqlite3.connect(path)
    db.executescript(_SCHEMA)
    return db


def start_run(db: sqlite3.Connection) -> int:
    run_id = db.execute("INSERT INTO runs DEFAULT VALUES").lastrowid
    db.commit()
    return run_id


def save_offers(db: sqlite3.Connection, run_id: int, offers: list[ShopOffer]):
    db.executemany(
        "INSERT INTO shop_offers (run_id, shop, sku, title, model, ean, price_nok, url)"
        " VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [(run_id, o.shop, o.sku, o.title, o.model, o.ean, o.price_nok, o.url) for o in offers],
    )
    db.commit()


def save_listings(db: sqlite3.Connection, run_id: int, listings: list[FinnListing]):
    db.executemany(
        "INSERT INTO finn_listings (run_id, ad_id, title, price_nok, condition, private_seller, url)"
        " VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
            (
                run_id,
                l.ad_id,
                l.title,
                l.price_nok,
                l.condition,
                None if l.private_seller is None else int(l.private_seller),
                l.url,
            )
            for l in listings
        ],
    )
    db.commit()


def save_deals(db: sqlite3.Connection, run_id: int, deals: list[Deal]):
    db.executemany(
        "INSERT INTO deals (run_id, shop, title, shop_price, finn_p25, n_listings, gevinst, pct, note)"
        " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            (run_id, d.offer.shop, d.offer.title, d.offer.price_nok,
             d.finn_p25, d.n_listings, d.gevinst, d.pct, d.note)
            for d in deals
        ],
    )
    db.commit()


def cache_get(db: sqlite3.Connection, url: str) -> str | None:
    row = db.execute(
        "SELECT body FROM http_cache WHERE url = ? AND fetched_at > ?",
        (url, time.time() - CACHE_TTL_S),
    ).fetchone()
    return row[0] if row else None


def cache_put(db: sqlite3.Connection, url: str, body: str):
    db.execute(
        "INSERT INTO http_cache (url, body, fetched_at) VALUES (?, ?, ?)"
        " ON CONFLICT(url) DO UPDATE SET body = excluded.body, fetched_at = excluded.fetched_at",
        (url, body, time.time()),
    )
    db.commit()
