# 🇮🇳 Project INDRA — CityForge Data Collection & GIS System

**INDRA CityForge** is an automated, modular, and beginner-friendly geographic data acquisition pipeline designed to extract real-world urban road networks, building footprints, pedestrian footpaths, green areas, and street furniture. The extracted data serves as the foundation for procedural 3D Indian urban city generation, autonomous micro-UGV navigation, and neural world-model training.

---

## 🎯 Target Pilot Area: Connaught Place, New Delhi

The initial pilot dataset (`delhi_cp_v1`) covers an exact **250 m × 250 m** metric area (62,500 m²) centered around Rajiv Chowk / Central Park Inner Circle in Connaught Place, New Delhi.

> [!NOTE]
> **Coverage Scope:** This pilot area captures a specific 250 m × 250 m sector of Connaught Place, not the entire circular commercial district (which spans over 800 m across).

- **Center Coordinates:** `28.63152° N, 77.21672° E`
- **Geographic CRS:** `EPSG:4326` (WGS 84, Lat/Lon in degrees)
- **Projected Metric CRS:** `EPSG:32643` (WGS 84 / UTM Zone 43N, Easting/Northing in meters)
- **Primary External Dataset Root:** `D:\INDRA_PROJECT` (configurable via `INDRA_DATASET_ROOT` env var or `config.yaml`)

---

## 🏗️ Pipeline Architecture

```text
tools/cityforge/
├── config.yaml               <- Configuration (coordinates, dimensions, CRS, storage roots, endpoints)
├── 00_define_area.py         <- Generates exact metric boundary.geojson in UTM Zone 43N
├── 01_roads.py               <- Extracts road network, lanes, one-way flags, surface types
├── 02_buildings.py           <- Extracts building footprints, levels, roof shapes, heights
├── 03_footpaths.py           <- Extracts footpaths, crossings, steps, and accessibility tags
├── 04_street_objects.py      <- Extracts traffic lights, streetlamps, trees, bollards, benches
├── 04b_landuse.py            <- Extracts park polygons, grass areas, commercial zones, retail plazas
├── 05_aerial_imagery.py      <- Generates georeferenced orthoimagery GeoTIFF (0.5m/px, UTM 43N)
├── 06_elevation.py           <- Generates terrain DEM GeoTIFF (2.5m spacing, EGM96 MSL vertical datum)
├── 07_street_photos.py       <- Discovers georeferenced public street photos (Wikimedia Commons CC)
├── 08_textures.py            <- Synthesizes 17 PBR materials (51 diffuse/normal/roughness maps)
├── import_external_assets.py <- Validates GeoTIFFs, checks overlap with pilot, and rejects plain rasters
├── generate_3d_city.py       <- Compiles 250m x 250m vector, DEM & PBR data into city_3d_scene.json
├── generate_qgis_project.py  <- Generates ready-to-open QGIS project (.qgs / .qgz) for desktop inspection
├── generate_transitions.py   <- Validates simulation physics and exports 1,000-5,000 transition smoke data
├── validate_data.py          <- Audits geometry validity, CRS consistency, null rates, and exports reports
├── pipeline.py               <- Unified CLI runner (--stage, --dry-run, caching)
├── requirements.txt          <- Minimal dependencies (pyproj, shapely, rasterio, pillow, requests, pyyaml)
└── README.md                 <- This documentation
```

---

## 💻 Step-by-Step PowerShell Guide

### 1. Checking Python Environment
Ensure Python 3.11, 3.12, or 3.14 is active on Windows:
```powershell
# Open PowerShell in INDRA root directory
cd C:\Users\AYUSH\Desktop\INDRA

# Check Python version
python --version
```

### 2. Installing Dependencies in Dedicated Virtual Environment
Keep geospatial libraries completely isolated from your core robotics and simulation Python environment:
```powershell
# Create dedicated virtual environment if not already created
python -m venv .venv_cityforge

# Activate the dedicated virtual environment
.\.venv_cityforge\Scripts\Activate.ps1

# Install minimal geospatial requirements
pip install -r tools/cityforge/requirements.txt
```

> [!WARNING]
> **Environment Isolation:** Do not confuse your QGIS Python interpreter (`C:\OSGeo4W\bin\python.exe`) with the project's virtual environment (`.venv_cityforge`). Run all CityForge pipeline scripts using `.venv_cityforge`.

---

### 3. Setting Up External Storage (`D:\INDRA_PROJECT`)
The pipeline stores large spatial datasets separately from source code under `D:\INDRA_PROJECT`.
If your Windows machine does not have a physical `D:` drive, you can instantly mount an alias drive using `subst`:
```powershell
# Mount virtual D: drive mapped to C:\INDRA_STORAGE (standard Windows user privilege)
if (-not (Test-Path "D:\")) {
    New-Item -ItemType Directory -Path "C:\INDRA_STORAGE" -Force
    subst D: "C:\INDRA_STORAGE"
}

# Verify drive D: is accessible
Test-Path "D:\"
```

---

### 4. Running CityForge Collection

#### Dry-Run Verification (Simulate Without Network Requests)
```powershell
.\.venv_cityforge\Scripts\python.exe tools/cityforge/pipeline.py --dry-run
```

#### Execute Only Vector Layers (Roads, Buildings, Footpaths, Street Objects, Land Use)
```powershell
.\.venv_cityforge\Scripts\python.exe tools/cityforge/pipeline.py --stage vector
```

#### Execute Entire Pipeline All-in-One
```powershell
.\.venv_cityforge\Scripts\python.exe tools/cityforge/pipeline.py --stage all
```

#### Or Run Individual Stages Step-by-Step
```powershell
# Stage 0: Define exact 250m x 250m metric boundary in EPSG:32643
.\.venv_cityforge\Scripts\python.exe tools/cityforge/00_define_area.py

# Stage 1: Collect road network centerlines and lane data
.\.venv_cityforge\Scripts\python.exe tools/cityforge/01_roads.py

# Stage 2: Collect building footprints and architectural levels
.\.venv_cityforge\Scripts\python.exe tools/cityforge/02_buildings.py

# Stage 3: Collect pedestrian walkways, crossings, and stairs
.\.venv_cityforge\Scripts\python.exe tools/cityforge/03_footpaths.py

# Stage 4: Collect street furniture and localized objects
.\.venv_cityforge\Scripts\python.exe tools/cityforge/04_street_objects.py

# Stage 4b: Collect land use, green areas, and central park plazas
.\.venv_cityforge\Scripts\python.exe tools/cityforge/04b_landuse.py

# Stage 5: Generate georeferenced aerial orthoimagery GeoTIFF
.\.venv_cityforge\Scripts\python.exe tools/cityforge/05_aerial_imagery.py

# Stage 6: Generate terrain elevation DEM GeoTIFF (EGM96 MSL)
.\.venv_cityforge\Scripts\python.exe tools/cityforge/06_elevation.py

# Stage 7: Discover georeferenced Creative Commons street photos
.\.venv_cityforge\Scripts\python.exe tools/cityforge/07_street_photos.py

# Stage 8: Synthesize PBR material texture library
.\.venv_cityforge\Scripts\python.exe tools/cityforge/08_textures.py

# Stage 9: Generate 3D procedural city scene (buildings, colonnades, hazards)
.\.venv_cityforge\Scripts\python.exe tools/cityforge/generate_3d_city.py

# Stage 10: Generate QGIS project file (instant GIS visualization)
.\.venv_cityforge\Scripts\python.exe tools/cityforge/generate_qgis_project.py
```

---

### 5. Validating Collected GIS Data
Run the automated validator to audit geometry validity, coordinate bounds, duplicate entities, and null rates:
```powershell
.\.venv_cityforge\Scripts\python.exe tools/cityforge/validate_data.py
```
*Reports are exported to `reports/data_quality_report.json` and `data_quality_report.md`.*

---

### 6. Importing Optional External GeoTIFFs & User Assets
If you place externally acquired satellite rasters, LiDAR DEMs, or camera photos in:
- `satellite/city_aerial.tif`
- `terrain/terrain_dem.tif`
- `street_photos/`
- `textures/`
- `measurements/`

Run the ingest tool to validate CRS, resolution, nodata, spatial overlap, and reject non-georeferenced images:
```powershell
.\.venv_cityforge\Scripts\python.exe tools/cityforge/import_external_assets.py
```

---

### 7. Opening GIS Output in QGIS Desktop
The pipeline automatically writes ready-to-open QGIS project files in EPSG:32643 (UTM Zone 43N) with styled layers:
```powershell
# Open directly in QGIS 3.34+ LTR
Start-Process "D:\INDRA_PROJECT\datasets\delhi_cp_v1\delhi_cp_v1.qgz"

# Or from the centralized QGIS projects folder
Start-Process "D:\INDRA_PROJECT\qgis_projects\delhi_cp_v1.qgz"
```

---

### 8. Starting the 3D Connaught Place Simulation
Run the web simulation server to navigate the real-world Connaught Place district in your browser:
```powershell
# Start INDRA server
python web/server.py
```
1. Open your browser at `http://localhost:8000`.
2. In the **Scenario Lab** dropdown, select:  
   **Scenario 11: Connaught Place Real-World Pilot (CityForge)**.
3. Observe the robot navigating around real extruded Georgian colonnade blocks, central park pathways, and stair hazards with live 16-beam radial LiDAR and receding-horizon MPC!

---

### 9. Generating Transition Smoke Datasets & Running Tests

#### Generate Standardized Transition Smoke Dataset
Collect 1,000–5,000 transitions containing `episode_id, step_index, timestamp_s, map_id, scenario_id, seed, state_t, observation_t, action_t, state_t1, observation_t1, dt_s, collision, terminated, truncated`:
```powershell
python tools/cityforge/generate_transitions.py --transitions 1200
```

#### Run All Automated Unit & Integration Tests
```powershell
# Run CityForge offline test suite (18 tests)
.\.venv_cityforge\Scripts\pytest tests/cityforge/ -v

# Run full INDRA accreditation smoke test suite (10 checks)
python scripts/smoke_test.py
```

---

## 🛠️ Diagnosing Common Windows & CRS Issues

| Issue / Error | Root Cause | Exact Remediation |
| :--- | :--- | :--- |
| **`Drive D: does not exist`** | Machine only has drive `C:`. | Run `subst D: C:\INDRA_STORAGE` to mount virtual drive D:. |
| **`ModuleNotFoundError: No module named 'pyproj'`** | Running with system Python instead of `.venv_cityforge`. | Use `.\.venv_cityforge\Scripts\python.exe` for GIS tools. |
| **`PermissionError: [WinError 32]` on `.npz` file** | `np.load` leaves zip file open on Windows. | Always use `with np.load(...) as data:` context manager. |
| **`HTTP 502 / 429 Overpass Timeout`** | Public OSM server under heavy load. | The pipeline automatically fails over to `lz4.overpass-api.de`. Local cache avoids repeated queries. |
| **Coordinates distorted / squished** | Map rendered in `EPSG:4326` (degrees). | Switch project CRS to `EPSG:32643` (UTM Zone 43N meters). |
| **Plain JPG/PNG rejected by importer** | Raster lacks geospatial header. | Use proper GeoTIFF format (`.tif`) with embedded CRS and affine transform tags. |

---

## 🛡️ Data Truthfulness and Safety Principles

- **Zero Fabricated Values:** Unmapped building heights, lane counts, or speed limits are strictly preserved as `null`. They are never guessed or claimed as empirical survey data.
- **Explicit Synthetic Assumptions:** Where visualization requires a height (e.g. 3D extrusion), it is labeled explicitly with `"is_synthetic_height": true` and `"height_provenance": "synthetic_assumption_3.4m_per_level"`.
- **Micro-UGV Safety Alerts:** Physical outdoor staircases and steps are flagged with `robot_traversable: false` to ensure autonomous wheeled rovers never attempt climb transitions without confirmed ramp access.
