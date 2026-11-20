"""
Project INDRA — CityForge: QGIS Project Generator.
Automatically creates a ready-to-open QGIS project file (delhi_cp_v1.qgs and delhi_cp_v1.qgz)
with all vector layers pre-configured, styled, and projected in EPSG:32643 (UTM Zone 43N).
Zero external GIS dependencies (pure Python standard library xml.etree and zipfile).
"""

import os
import sys
import zipfile
import xml.etree.ElementTree as ET
from xml.dom import minidom

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, "..", ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from tools.cityforge.osm_client import load_config, resolve_output_dir, logger


def create_qgis_project(config_path: str = None) -> str:
    """Generate self-contained QGIS project XML and .qgz archive."""
    cfg = load_config(config_path)
    out_dir = resolve_output_dir(cfg, PROJECT_ROOT)
    proc_dir = os.path.join(out_dir, "processed")

    boundary_file = os.path.join(out_dir, "boundary.geojson")
    roads_file = os.path.join(proc_dir, "roads.geojson")
    buildings_file = os.path.join(proc_dir, "buildings.geojson")
    walkways_file = os.path.join(proc_dir, "footpaths.geojson")
    if not os.path.exists(walkways_file):
        walkways_file = os.path.join(proc_dir, "walkways.geojson")
    street_objects_file = os.path.join(proc_dir, "street_objects.geojson")
    landuse_file = os.path.join(proc_dir, "landuse.geojson")

    # Relative paths from project file located in out_dir
    rel_boundary = "./boundary.geojson"
    rel_roads = "./processed/roads.geojson"
    rel_buildings = "./processed/buildings.geojson"
    rel_walkways = "./processed/footpaths.geojson" if os.path.exists(os.path.join(proc_dir, "footpaths.geojson")) else "./processed/walkways.geojson"
    rel_street_objects = "./processed/street_objects.geojson"
    rel_landuse = "./processed/landuse.geojson"

    qgs_root = ET.Element("qgis", projectname="INDRA_CityForge_Delhi_CP_v1", version="3.34.0-LTR")

    # 1. Project CRS: EPSG:32643 (WGS 84 / UTM Zone 43N)
    proj_crs = ET.SubElement(qgs_root, "projectCrs")
    spatialrefsys = ET.SubElement(proj_crs, "spatialrefsys", nativeFormat="Wkt")
    ET.SubElement(spatialrefsys, "wkt").text = 'PROJCRS["WGS 84 / UTM zone 43N",BASEGEOGCRS["WGS 84",DATUM["World Geodetic System 1984",ELLIPSOID["WGS 84",6378137,298.257223563]],PRIMEM["Greenwich",0],CS[ellipsoidal,2],AXIS["geodetic latitude (Lat)",north],AXIS["geodetic longitude (Lon)",east],UNIT["degree",0.0174532925199433]],CONVERSION["UTM zone 43N",METHOD["Transverse Mercator",ID["EPSG",9807]],PARAMETER["Latitude of natural origin",0],PARAMETER["Longitude of natural origin",75],PARAMETER["Scale factor at natural origin",0.9996],PARAMETER["False easting",500000],PARAMETER["False northing",0],UNIT["metre",1]],CS[Cartesian,2],AXIS["easting (X)",east],AXIS["northing (Y)",north],UNIT["metre",1],ID["EPSG",32643]]'
    ET.SubElement(spatialrefsys, "proj4").text = "+proj=utm +zone=43 +datum=WGS84 +units=m +no_defs"
    ET.SubElement(spatialrefsys, "srsid").text = "3127"
    ET.SubElement(spatialrefsys, "srid").text = "32643"
    ET.SubElement(spatialrefsys, "authid").text = "EPSG:32643"
    ET.SubElement(spatialrefsys, "description").text = "WGS 84 / UTM zone 43N"

    # 2. Map Canvas Extent (Centered on Connaught Place 250m Pilot)
    # UTM Bounds: [716574.09, 3169046.62, 716824.09, 3169296.62]
    mapcanvas = ET.SubElement(qgs_root, "mapcanvas", name="theMapCanvas")
    dest_srs = ET.SubElement(mapcanvas, "destinationsrs")
    dest_spatial = ET.SubElement(dest_srs, "spatialrefsys")
    ET.SubElement(dest_spatial, "authid").text = "EPSG:32643"

    extent = ET.SubElement(mapcanvas, "extent")
    ET.SubElement(extent, "xmin").text = "716540.0"
    ET.SubElement(extent, "ymin").text = "3169010.0"
    ET.SubElement(extent, "xmax").text = "716860.0"
    ET.SubElement(extent, "ymax").text = "3169330.0"

    # 3. Layer Tree and Project Layers
    project_layers = ET.SubElement(qgs_root, "projectlayers")
    layer_tree = ET.SubElement(qgs_root, "layer-tree-group")

    layers_def = [
        {"id": "indra_street_objects", "name": "INDRA 04 - Street Objects & Trees", "path": rel_street_objects, "geom": "Point", "color": "168,85,247"},
        {"id": "indra_walkways", "name": "INDRA 03 - Walkways & Stairs", "path": rel_walkways, "geom": "LineString", "color": "56,189,248"},
        {"id": "indra_roads", "name": "INDRA 01 - Road Network Corridors", "path": rel_roads, "geom": "LineString", "color": "245,158,11"},
        {"id": "indra_buildings", "name": "INDRA 02 - Building Footprints & Colonnades", "path": rel_buildings, "geom": "Polygon", "color": "220,150,110"},
        {"id": "indra_landuse", "name": "INDRA 04b - Land Use & Green Areas", "path": rel_landuse, "geom": "Polygon", "color": "74,222,128"},
        {"id": "indra_boundary", "name": "INDRA 00 - Pilot Boundary (250m x 250m)", "path": rel_boundary, "geom": "Polygon", "color": "239,68,68"}
    ]

    for lyr in layers_def:
        maplayer = ET.SubElement(project_layers, "maplayer", type="vector", geometry=lyr["geom"], hasScaleBasedVisibilityFlag="0")
        ET.SubElement(maplayer, "id").text = lyr["id"]
        ET.SubElement(maplayer, "datasource").text = lyr["path"]
        ET.SubElement(maplayer, "layername").text = lyr["name"]
        ET.SubElement(maplayer, "provider").text = "ogr"

        lyr_tree_item = ET.SubElement(layer_tree, "layer-tree-layer", id=lyr["id"], name=lyr["name"], checked="Qt::Checked", expanded="1")

    # Serialize to XML string
    xml_str = ET.tostring(qgs_root, encoding="utf-8")
    pretty_xml = minidom.parseString(xml_str).toprettyxml(indent="  ")

    # Save .qgs (plain XML project)
    dataset_id = cfg.get("dataset_id", "delhi_cp_v1")
    qgs_path = os.path.join(out_dir, f"{dataset_id}.qgs")
    with open(qgs_path, "w", encoding="utf-8") as f:
        f.write(pretty_xml)

    # Save .qgz (compressed archive container)
    qgz_path = os.path.join(out_dir, f"{dataset_id}.qgz")
    with zipfile.ZipFile(qgz_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        zf.writestr(f"{dataset_id}.qgs", pretty_xml.encode("utf-8"))

    # Also mirror into D:\INDRA_PROJECT\qgis_projects if available
    ext_qgis_dir = r"D:\INDRA_PROJECT\qgis_projects"
    if os.path.exists(ext_qgis_dir):
        try:
            import shutil
            shutil.copy2(qgs_path, os.path.join(ext_qgis_dir, f"{dataset_id}.qgs"))
            shutil.copy2(qgz_path, os.path.join(ext_qgis_dir, f"{dataset_id}.qgz"))
        except Exception:
            pass

    logger.info(f"Generated QGIS Project files: {qgs_path} and {qgz_path}")
    return qgz_path


if __name__ == "__main__":
    create_qgis_project()
