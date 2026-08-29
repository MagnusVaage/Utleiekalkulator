"""HTTP-lag: høflig fetching med rate limiting, robots.txt og 6 t cache.

All trafikk går sekvensielt gjennom én klient, så «maks 1 samtidig
forespørsel per domene» holder automatisk. Mellom forespørsler til samme
domene ventes 2–5 sekunder (tilfeldig).
"""

import json
import random
import time
from urllib.parse import urlsplit
from urllib.robotparser import RobotFileParser

import httpx

from .db import cache_get, cache_put

USER_AGENT = "utleiekalkulator-scraper/0.1 (personlig prissammenligning)"
DELAY_RANGE_S = (2.0, 5.0)


class RobotsDisallowed(Exception):
    pass


class Http:
    def __init__(self, db, use_cache: bool = True):
        self._db = db
        self._use_cache = use_cache
        self._last_request: dict[str, float] = {}
        self._robots: dict[str, RobotFileParser] = {}
        self._client = httpx.Client(
            headers={
                "user-agent": USER_AGENT,
                "accept": "application/json, text/html;q=0.9",
                "accept-language": "nb-NO,nb;q=0.9",
            },
            timeout=20,
            follow_redirects=True,
        )

    def get_json(self, url: str):
        return json.loads(self.get_text(url))

    def get_text(self, url: str) -> str:
        if self._use_cache:
            cached = cache_get(self._db, url)
            if cached is not None:
                return cached
        if not self._allowed(url):
            raise RobotsDisallowed(f"robots.txt forbyr {url}")
        body = self._fetch(url)
        if self._use_cache:
            cache_put(self._db, url, body)
        return body

    def _fetch(self, url: str) -> str:
        host = urlsplit(url).netloc
        elapsed = time.monotonic() - self._last_request.get(host, float("-inf"))
        wait = random.uniform(*DELAY_RANGE_S) - elapsed
        if wait > 0:
            time.sleep(wait)
        try:
            response = self._client.get(url)
            response.raise_for_status()
            return response.text
        finally:
            self._last_request[host] = time.monotonic()

    def _allowed(self, url: str) -> bool:
        host = urlsplit(url).netloc
        parser = self._robots.get(host)
        if parser is None:
            parser = RobotFileParser()
            try:
                parser.parse(self._fetch(f"https://{host}/robots.txt").splitlines())
            except httpx.HTTPStatusError as err:
                if err.response.status_code >= 500:
                    raise
                parser.allow_all = True  # 4xx = ingen robots.txt publisert
            self._robots[host] = parser
        return parser.can_fetch(USER_AGENT, url)

    def close(self):
        self._client.close()
