# Blender Procedural Generation

This folder contains the pipeline for generating the 360° clay-render panoramas for the virtual tour.

## Files
- `rooms.json`: The data source for room dimensions, furniture, and connections.
- `generate_rooms.py`: The Blender Python script that builds the rooms.

## How to Run

1. Open **Blender**.
2. Go to the **Scripting** tab.
3. Click **Open** and select `generate_rooms.py`.
4. Ensure `rooms.json` is in the same folder as the script (or the Blender file).
5. Press **Run Script**.

### What happens:
- The script clears the scene.
- It iterates through each room in the JSON.
- It creates walls, floor, and ceiling.
- It places procedural furniture (cubes/rectangles) in the specified positions.
- It applies the **Clay Render** material palette (matte, soft shades).
- It sets up a 360° Equirectangular camera in the center of the room.

## Rendering
To render the panoramas, ensure your render engine is set to **Cycles** (required for Equirectangular panorama type).
The script sets up the cameras; you can then render each room's camera to a file (e.g., `renders/living-room.png`).
