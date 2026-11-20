"""
Project INDRA — CityForge Shared Overpass Client and Geospatial Utilities.
Provides deterministic local caching, multi-endpoint failover, rate-limit throttling,
and robust JSON/GeoJSON parsing.
"""

import os
import sys
import time
import json
import logging
from typing import Dict, Any, List, Optional, Tuple
import yaml
import requests
import pyproj
from shapely.geometry import shape, mapping, Polygon, LineString, Point

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("cityforge")


def load_config(config_path: Optional[str] = None) -> Dict[str, Any]:
    """Load CityForge configuration YAML."""
    if not config_path:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        config_path = os.path.join(base_dir, "config.yaml")

    if not os.path.exists(config_path):
        raise FileNotFoundError(f"CityForge config file not found: {config_path}")

    with open(config_path, "r", encoding="utf-8") as f:
        cfg = yaml.safe_load(f)
    return cfg


def get_transformers(geographic_crs: str = "EPSG:4326", projected_crs: str = "EPSG:32643"):
    """
    Return bidirectional coordinate transformers:
      to_proj: (lon, lat) -> (easting_m, northing_m)
      to_wgs84: (easting_m, northing_m) -> (lon, lat)
    """
    to_proj = pyproj.Transformer.from_crs(geographic_crs, projected_crs, always_xy=True)
    to_wgs84 = pyproj.Transformer.from_crs(projected_crs, geographic_crs, always_xy=True)
    return to_proj, to_wgs84


def execute_overpass_query(
    query_str: str,
    cache_path: str,
    config: Optional[Dict[str, Any]] = None,
    use_cache: bool = True,
    rate_delay: float = 1.5
) -> Dict[str, Any]:
    """
    Execute Overpass API query with disk caching and multi-endpoint failover.
    """
    config = config or load_config()

    if use_cache and os.path.exists(cache_path):
        logger.info(f"Loading cached response from: {cache_path}")
        with open(cache_path, "r", encoding="utf-8") as f:
            return json.load(f)

    endpoints = config.get("overpass_endpoints", [
        "https://overpass-api.de/api/interpreter",
        "https://overpass.kumi.systems/api/interpreter"
    ])
    user_agent = config.get("user_agent", "ProjectINDRA-CityForge/1.0")
    timeout = config.get("timeout_seconds", 35)
    max_retries = config.get("max_retries", 3)
    backoff = config.get("retry_backoff_seconds", 2.0)

    headers = {
        "User-Agent": user_agent,
        "Accept": "application/json"
    }

    last_error = None
    for endpoint in endpoints:
        for attempt in range(1, max_retries + 1):
            try:
                logger.info(f"Querying Overpass endpoint ({endpoint}) [Attempt {attempt}/{max_retries}]...")
                resp = requests.post(
                    endpoint,
                    data={"data": query_str},
                    headers=headers,
                    timeout=timeout
                )
                if resp.status_code == 200:
                    data = resp.json()
                    os.makedirs(os.path.dirname(os.path.abspath(cache_path)), exist_ok=True)
                    with open(cache_path, "w", encoding="utf-8") as f:
                        json.dump(data, f, indent=2)
                    logger.info(f"Overpass query successful. Saved cache to {cache_path}")
                    if rate_delay > 0:
                        time.sleep(rate_delay)
                    return data
                elif resp.status_code == 429:
                    wait_time = backoff * (2 ** attempt)
                    logger.warning(f"Overpass 429 Rate Limited. Sleeping {wait_time:.1f}s before retry...")
                    time.sleep(wait_time)
                else:
                    logger.warning(f"Endpoint returned HTTP {resp.status_code}: {resp.text[:120]}")
            except Exception as e:
                logger.warning(f"Endpoint connection failed ({e}). Retrying...")
                last_error = e
                time.sleep(backoff * attempt)

    raise RuntimeError(f"All Overpass API endpoints failed. Last error: {last_error}")


def build_node_dict(elements: List[Dict[str, Any]]) -> Dict[int, Tuple[float, float]]:
    """Build a node lookup table: node_id -> (lon, lat)."""
    nodes = {}
    for elem in elements:
        if elem.get("type") == "node" and "lon" in elem and "lat" in elem:
            nodes[elem["id"]] = (float(elem["lon"]), float(elem["lat"]))
    return nodes
