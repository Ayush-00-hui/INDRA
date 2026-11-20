# 🇮🇳 Project INDRA — CityForge Data Collection System

**INDRA CityForge** is an automated, modular, and beginner-friendly geographic data acquisition pipeline designed to extract real-world urban road networks, building footprints, pedestrian walkways, and street furniture. The extracted data serves as the foundation for procedural 3D Indian urban city generation, autonomous micro-UGV navigation, and neural world-model training.

---

## 🎯 Target Pilot Area: Connaught Place, New Delhi

The initial pilot dataset (`delhi_cp_v1`) covers an exact **250 m × 250 m** metric area (62,500 m²) centered around Rajiv Chowk / Central Park Inner Circle in Connaught Place, New Delhi.

> [!NOTE]
> **Coverage Scope:** This pilot area captures a specific 250 m × 250 m sector of Connaught Place, not the entire circular commercial district (which spans over 800 m across).

- **Center Coordinates:** `28.63152° N, 77.21672° E`
- **Geographic CRS:** `EPSG:4326` (WGS 84, Lat/Lon in degrees)
- **Projected Metric CRS:** `EPSG:32643` (WGS 84 / UTM Zone 43N, Easting/Northing in meters)

---

## 🏗️ Pipeline Architecture

```text
tools/cityforge/
├── config.yaml               <- Configuration (coordinates, dimensions, CRS, endpoints)
├── 00_define_area.py         <- Generates exact metric boundary.geojson in UTM Zone 43N
├── 01_roads.py               <- Extracts road network, lanes, one-way flags, surface types
├── 02_buildings.py           <- Extracts building footprints, levels, roof shapes, heights
├── 03_footpaths.py           <- Extracts sidewalks, crossings, steps, and accessibility tags
├── 04_street_objects.py      <- Extracts traffic lights, streetlamps, trees, bollards, benches
├── 05_aerial_imagery.py      <- Generates georeferenced orthoimagery GeoTIFF (0.5m/px, UTM 43N)
├── 06_elevation.py           <- Generates terrain DEM GeoTIFF (2.5m spacing, EGM96 MSL vertical datum)
├── 07_street_photos.py       <- Discovers georeferenced public street photos (Wikimedia Commons CC)
├── 08_textures.py            <- Synthesizes 17 PBR materials (51 diffuse/normal/roughness maps)
├── generate_3d_city.py       <- Compiles 250m x 250m vector, DEM & PBR data into city_3d_scene.json
├── validate_data.py          <- Audits geometry validity, CRS consistency, raster & texture assets
├── pipeline.py               <- Unified CLI runner (--stage, --dry-run, caching)
├── requirements.txt          <- Minimal dependencies (pyproj, shapely, rasterio, pillow, requests, pyyaml)
└── README.md                 <- This documentation
```

---

## 💻 Installation (Windows)

Use the dedicated Python virtual environment to avoid modifying any base system dependencies:

```powershell
# 1. Open PowerShell in INDRA root directory
cd C:\Users\AYUSH\Desktop\INDRA

# 2. Activate the dedicated virtual environment
.\.venv_cityforge\Scripts\Activate.ps1

# 3. Verify installed packages
pip list
```

---

## 🚀 Running the Pipeline

You can run individual stages or execute the entire pipeline with a single command:

### 1. Dry-Run Verification (No Network Requests)
```powershell
python tools/cityforge/pipeline.py --dry-run
```

### 2. Stage-by-Stage Execution
```powershell
# Stage 0: Define exact 250m x 250m metric boundary
python tools/cityforge/00_define_area.py

# Stage 1: Collect road network
python tools/cityforge/01_roads.py

# Stage 2: Collect building footprints
python tools/cityforge/02_buildings.py

# Stage 3: Collect pedestrian walkways and crossings
python tools/cityforge/03_footpaths.py

# Stage 4: Collect street furniture and objects
python tools/cityforge/04_street_objects.py

# Stage 5: Collect georeferenced aerial orthoimagery GeoTIFF
python tools/cityforge/05_aerial_imagery.py

# Stage 6: Collect terrain elevation DEM GeoTIFF
python tools/cityforge/06_elevation.py

# Stage 7: Discover georeferenced street photos
python tools/cityforge/07_street_photos.py

# Stage 8: Synthesize PBR material texture library
python tools/cityforge/08_textures.py

# Stage 9: Generate 3D procedural city scene (buildings, roads, colonnades, stairs)
python tools/cityforge/generate_3d_city.py

# Stage 10: Run data quality and geometry validation
python tools/cityforge/validate_data.py
```

### 3. All-in-One Execution via Pipeline CLI
```powershell
python tools/cityforge/pipeline.py --stage all
```

---

## 📂 Output Data Structure

All generated datasets and audit reports are saved under `data/cityforge/delhi_cp_v1/`:

```text
data/cityforge/delhi_cp_v1/
├── boundary.geojson                    <- Pilot perimeter in WGS84 with metric properties
├── metadata/
│   ├── boundary_metadata.json         <- Provenance, exact UTM coordinates, dimensions
│   ├── aerial_sources.json            <- Imagery source, resolution, and affine transform
│   └── elevation_sources.json         <- DEM source, EGM96 MSL vertical datum, grid resolution
├── raw/
│   ├── roads_overpass.json            <- Cached raw OSM API response for roads
│   ├── buildings_overpass.json        <- Cached raw OSM API response for buildings
│   ├── footpaths_overpass.json        <- Cached raw OSM API response for footpaths
│   └── street_objects_overpass.json   <- Cached raw OSM API response for furniture
├── processed/
│   ├── roads.geojson                  <- Clipped road centerlines with widths & surface
│   ├── buildings.geojson              <- Building polygons with levels & measured heights
│   ├── walkways.geojson               <- Sidewalks, pedestrian crossings & steps
│   └── street_objects.geojson         <- Classified point features (signals, lamps, trees)
├── imagery/
│   └── city_aerial.tif                <- 500x500 RGB GeoTIFF (0.5m/px) in UTM Zone 43N
├── elevation/
│   ├── terrain_dem.tif                <- 100x100 Float32 DEM GeoTIFF (2.5m/cell)
│   └── elevation_grid.json            <- Machine-readable elevation matrix
├── photos/
│   ├── photo_index.csv                <- CSV index with CC license and camera headings
│   └── photo_metadata.json            <- Structured photo records and image URLs
├── textures/
│   ├── texture_manifest.json          <- PBR material index across 8 categories
│   ├── asphalt/                       <- Diffuse, normal, and roughness maps
│   ├── bricks/                        <- Diffuse, normal, and roughness maps
│   ├── concrete/                      <- Diffuse, normal, and roughness maps
│   ├── footpath/                      <- Diffuse, normal, and roughness maps
│   ├── markings/                      <- Diffuse, normal, and roughness maps
│   ├── plaster/                       <- Diffuse, normal, and roughness maps
│   ├── roofing/                       <- Diffuse, normal, and roughness maps
│   └── shutters/                      <- Diffuse, normal, and roughness maps
└── reports/
    ├── roads_summary.json             <- Road length, lane completeness, missing width %
    ├── buildings_summary.json         <- Building count, area, missing height %
    ├── walkways_summary.json          <- Walkway length, stairs detection, crossing count
    ├── street_objects_summary.json    <- Object category distribution
    ├── data_quality_report.json       <- Comprehensive validation results
    └── data_quality_report.md         <- Human-readable data quality report
```

---

## 🔍 Why Each Dataset Matters for Autonomous Robotics

1. **Road Network (`roads.geojson`):** Centerlines and lane counts define drivable corridors for autonomous delivery vehicles. Unmapped surface types are preserved as `null` so physical friction can be conservatively modeled.
2. **Building Footprints (`buildings.geojson`):** Provides obstacle occlusions and urban canyons that degrade GNSS signals and LiDAR rays. Missing heights are kept as `null` (never fabricated).
3. **Walkways & Footpaths (`walkways.geojson`):** Defines sidewalks and pedestrian zones. Crucially, **physical steps/stairs are flagged as impassable** to prevent wheeled micro-UGVs from tipping over.
4. **Street Objects (`street_objects.geojson`):** Localized bollards, trees, streetlights, and signals allow procedural placement of collision cylinders and visual props in simulation.
5. **Aerial Imagery (`city_aerial.tif`):** High-resolution georeferenced orthoimagery used for top-down ground-truth visual matching, ground plane texturing, and overhead obstacle verification.
6. **Terrain Elevation (`terrain_dem.tif`):** Topographical elevation grid in EGM96 MSL vertical datum modeling macro terrain slope, drainage contours, and pitch angles for robot powertrain load calculations.
7. **Street Photos (`photo_index.csv`):** Permitted open-access photographic references with Creative Commons licenses used for visual realism alignment, façade material mapping, and synthetic camera view calibration.
8. **PBR Textures (`textures/`):** 17 seamless physically based rendering materials (51 diffuse, normal, roughness maps) providing realistic surface reflection and depth for Three.js rendering and camera simulation.

---

## 🗺️ How to View GeoJSON Files in QGIS

1. Download and install **QGIS** (free, open-source GIS software from [qgis.org](https://qgis.org/)).
2. Launch QGIS and start a **New Empty Project**.
3. In File Explorer, navigate to `INDRA/data/cityforge/delhi_cp_v1/` and drag `boundary.geojson` into the QGIS map canvas.
4. Drag and drop `roads.geojson`, `buildings.geojson`, `walkways.geojson`, and `street_objects.geojson`.
5. Click the CRS icon at the bottom-right corner of QGIS and select **EPSG:32643 (WGS 84 / UTM Zone 43N)** to view the area in a true metric Cartesian grid without longitudinal distortion.

---

## 🛡️ Data Truthfulness and Safety Principles

- **No Fabricated Measurements:** Attributes missing in the real-world survey (such as height or speed limit) are explicitly stored as `null`. We never inject fake numbers and claim they are empirical measurements.
- **Local Disk Caching:** Raw API responses are cached in `data/cityforge/delhi_cp_v1/raw/` to prevent redundant queries and avoid overloading public community servers.
- **Rate-Limit Backoff:** Queries include user-agent headers and exponential backoff to handle HTTP 429 rate limits gracefully.
