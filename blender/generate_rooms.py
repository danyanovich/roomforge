import bpy
import json
import math
import os

# --- Configuration ---
JSON_PATH = bpy.path.abspath("//rooms.json")
OUTPUT_DIR = bpy.path.abspath("//renders")
PALETTE = {
    "walls": (0.941, 0.929, 0.910, 1),    # #f0ede8
    "floor": (0.851, 0.816, 0.773, 1),    # #d9d0c5
    "furniture": (0.749, 0.710, 0.659, 1), # #bfb5a8
    "accents": (0.227, 0.208, 0.188, 1)    # #3a3530
}

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def clear_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)

def create_material(name, color, roughness=0.9):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
    bsdf.inputs['Base Color'].default_value = color
    bsdf.inputs['Roughness'].default_value = roughness
    return mat

def create_wall(name, size, pos, rot, material):
    bpy.ops.mesh.primitive_plane_add(size=1, location=pos, rotation=rot)
    wall = bpy.context.active_object
    wall.name = name
    wall.scale = (size[0], size[1], 1)
    wall.data.materials.append(material)
    return wall

def create_room(room_data):
    name = room_data['roomName']
    w = room_data['dimensions']['width_m']
    d = room_data['dimensions']['depth_m']
    h = room_data['dimensions']['height_m']
    
    # Collection for cleanup/organization
    coll = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(coll)
    
    # Materials
    mat_wall = create_material(f"Mat_Wall_{name}", PALETTE['walls'])
    mat_floor = create_material(f"Mat_Floor_{name}", PALETTE['floor'])
    mat_furn = create_material(f"Mat_Furn_{name}", PALETTE['furniture'])
    
    # Floor
    bpy.ops.mesh.primitive_plane_add(size=1, location=(w/2, d/2, 0))
    floor = bpy.context.active_object
    floor.scale = (w, d, 1)
    floor.data.materials.append(mat_floor)
    coll.objects.link(floor)
    
    # Walls (Simplified plane walls)
    # North
    create_wall(f"Wall_N_{name}", (w, h), (w/2, d, h/2), (math.radians(90), 0, 0), mat_wall)
    # South
    create_wall(f"Wall_S_{name}", (w, h), (w/2, 0, h/2), (math.radians(-90), 0, 0), mat_wall)
    # East
    create_wall(f"Wall_E_{name}", (d, h), (w, d/2, h/2), (0, math.radians(90), 0), mat_wall)
    # West
    create_wall(f"Wall_W_{name}", (d, h), (0, d/2, h/2), (0, math.radians(-90), 0), mat_wall)
    
    # Procedural Furniture
    for item in room_data.get('furniture', []):
        f_pos = item['position']
        f_type = item['type']
        
        if f_type == 'sofa':
            # Base
            bpy.ops.mesh.primitive_cube_add(size=1, location=(f_pos[0], f_pos[2], 0.2))
            sofa = bpy.context.active_object
            sofa.scale = (2.0, 0.8, 0.4)
            sofa.data.materials.append(mat_furn)
            # Back
            bpy.ops.mesh.primitive_cube_add(size=1, location=(f_pos[0], f_pos[2] + 0.3, 0.6))
            back = bpy.context.active_object
            back.scale = (2.0, 0.2, 0.8)
            back.data.materials.append(mat_furn)
            
        elif f_type == 'coffee_table':
            bpy.ops.mesh.primitive_cube_add(size=1, location=(f_pos[0], f_pos[2], 0.2))
            table = bpy.context.active_object
            table.scale = (0.8, 0.8, 0.4)
            table.data.materials.append(mat_furn)
            
        elif f_type == 'bed':
            bpy.ops.mesh.primitive_cube_add(size=1, location=(f_pos[0], f_pos[2], 0.3))
            bed = bpy.context.active_object
            bed.scale = (1.6, 2.0, 0.6)
            bed.data.materials.append(mat_furn)

    # Camera Setup for 360
    cam_data = bpy.data.cameras.new(f"Cam_{name}")
    cam_obj = bpy.context.scene.collection.objects.link(bpy.data.objects.new(f"Cam_{name}", cam_data))
    cam_obj = bpy.data.objects[f"Cam_{name}"]
    cam_obj.location = (w/2, d/2, 1.6)
    cam_data.type = 'PANO'
    cam_data.cycles.panorama_type = 'EQUIRECTANGULAR'
    
    # Lighting
    bpy.ops.object.light_add(type='AREA', location=(w/2, d/2, h - 0.1))
    light = bpy.context.active_object
    light.data.energy = 500
    light.scale = (w, d, 1)

def main():
    clear_scene()
    
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        rooms_data = json.load(f)
        
    for room in rooms_data:
        create_room(room)
        
    print("Generation complete.")

if __name__ == "__main__":
    main()
