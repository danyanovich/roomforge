const VARIANT_TIER_CONFIG = {
  Compact: { label: 'Compact', material: 'laminate' },
  Standard: { label: 'Standard', material: 'oak' },
  Premium: { label: 'Premium', material: 'walnut' },
  Minimal: { label: 'Minimal', material: 'powder-coated steel' },
  Statement: { label: 'Statement', material: 'velvet' },
};

export const VARIANT_TIERS = Object.keys(VARIANT_TIER_CONFIG);

export const COLOR_SWATCHES = [
  '#F6F1E8',
  '#E3D1BA',
  '#D19B7B',
  '#B5C1A8',
  '#9CB8C9',
  '#536878',
  '#B67A6A',
  '#A79184',
  '#3F454A',
  '#D9C9D8',
];

export const PROPERTY_TYPES = [
  { id: 'apartment', label: 'Apartment' },
  { id: 'house', label: 'House' },
];

export const STYLE_PRESETS = [
  {
    id: 'minimal',
    label: 'Minimal',
    palette: {
      background: '#F4EFE8',
      panel: '#FFF9F1',
      panelSoft: '#F5EBDD',
      accent: '#4D443E',
      line: '#BBAA99',
      roomFill: '#F8F2EA',
      roomStroke: '#B9AA9B',
      grid: '#E6DDD3',
      object: '#B99072',
      platform: '#DCCBB9',
      wall: '#ECE3D8',
      floor: '#D5B18F',
      ceiling: '#FBF7F2',
      shadow: '#8D7864',
      highlight: '#E9C46A',
    },
  },
  {
    id: 'scandinavian',
    label: 'Scandinavian',
    palette: {
      background: '#EEF3F4',
      panel: '#FFFFFF',
      panelSoft: '#F4F8F7',
      accent: '#55707B',
      line: '#9EB7BE',
      roomFill: '#F8FBFB',
      roomStroke: '#9FB1B7',
      grid: '#D6E1E4',
      object: '#B88267',
      platform: '#D8E3E5',
      wall: '#F6FAFA',
      floor: '#D9C3A5',
      ceiling: '#FFFFFF',
      shadow: '#79939A',
      highlight: '#F2C572',
    },
  },
  {
    id: 'japandi',
    label: 'Japandi',
    palette: {
      background: '#F1ECE4',
      panel: '#FBF6EF',
      panelSoft: '#F0E7DA',
      accent: '#5E574D',
      line: '#B4A693',
      roomFill: '#F7F1E8',
      roomStroke: '#A99884',
      grid: '#DDD2C4',
      object: '#9D7659',
      platform: '#DCCDBB',
      wall: '#EEE4D8',
      floor: '#C4A484',
      ceiling: '#F8F4EE',
      shadow: '#857260',
      highlight: '#D8B46A',
    },
  },
  {
    id: 'loft',
    label: 'Loft',
    palette: {
      background: '#E7E3DF',
      panel: '#F7F5F3',
      panelSoft: '#ECE7E2',
      accent: '#433D39',
      line: '#8E8178',
      roomFill: '#F3EFEB',
      roomStroke: '#90847B',
      grid: '#D4CBC4',
      object: '#A4644D',
      platform: '#C8BCB1',
      wall: '#E7DED6',
      floor: '#A98060',
      ceiling: '#F8F6F3',
      shadow: '#6F655D',
      highlight: '#F4B266',
    },
  },
  {
    id: 'warm-neutral',
    label: 'Warm Neutral',
    palette: {
      background: '#F6EFE4',
      panel: '#FFFBF5',
      panelSoft: '#F6EBDD',
      accent: '#725F52',
      line: '#B8A292',
      roomFill: '#FBF5EC',
      roomStroke: '#B49E8B',
      grid: '#E7DCCF',
      object: '#C28D67',
      platform: '#DFC9B2',
      wall: '#F4E9DC',
      floor: '#D1A883',
      ceiling: '#FEFAF3',
      shadow: '#9A7F69',
      highlight: '#EAB85C',
    },
  },
  {
    id: 'modern-classic',
    label: 'Modern Classic',
    palette: {
      background: '#EEE8E2',
      panel: '#FBF8F4',
      panelSoft: '#F1EAE2',
      accent: '#4F4A56',
      line: '#A59AA7',
      roomFill: '#FBF8F3',
      roomStroke: '#ACA0A9',
      grid: '#DDD5D9',
      object: '#8A6F89',
      platform: '#D3CBD3',
      wall: '#F1EAE5',
      floor: '#C19D84',
      ceiling: '#FFFFFF',
      shadow: '#7A6B76',
      highlight: '#D5AA66',
    },
  },
];

export const LIGHTING_SCENARIOS = [
  { id: 'day', label: 'Day', ambient: 0.8, sun: 1.25, accent: 0.22, tint: '#FFF6E9' },
  { id: 'evening', label: 'Evening', ambient: 0.54, sun: 0.78, accent: 0.45, tint: '#FFD6B1' },
  { id: 'warm-light', label: 'Warm Light', ambient: 0.66, sun: 0.9, accent: 0.52, tint: '#F5C992' },
  { id: 'cool-light', label: 'Cool Light', ambient: 0.72, sun: 1.05, accent: 0.34, tint: '#CFE1F5' },
  { id: 'night', label: 'Night', ambient: 0.34, sun: 0.2, accent: 0.6, tint: '#9AB4D0' },
];

const CATEGORY_DEFINITIONS = [
  {
    id: 'living-room',
    label: 'Living Room',
    roomTypes: ['living-room', 'studio', 'kitchen-living-room'],
    items: ['Sofa', 'Armchair', 'Coffee Table', 'TV Stand', 'Television', 'Bookcase', 'Console Table', 'Pouf', 'Bench', 'Decorative Fireplace'],
  },
  {
    id: 'bedroom',
    label: 'Bedroom',
    roomTypes: ['bedroom'],
    items: ['Bed', 'Mattress', 'Nightstand', 'Dresser', 'Wardrobe', 'Vanity Table', 'Blanket', 'Pillow', 'Bench', 'Floor Mirror'],
  },
  {
    id: 'kitchen',
    label: 'Kitchen',
    roomTypes: ['kitchen', 'kitchen-living-room'],
    items: ['Kitchen Cabinet Set', 'Kitchen Island', 'Refrigerator', 'Cooktop', 'Microwave', 'Dishwasher', 'Range Hood', 'Kitchen Sink', 'Backsplash', 'Bar Counter'],
  },
  {
    id: 'dining',
    label: 'Dining',
    roomTypes: ['dining', 'kitchen-living-room'],
    items: ['Dining Table', 'Dining Chair', 'Sideboard', 'Buffet', 'Display Cabinet', 'Bar Stool', 'Table Runner', 'Decorative Plates'],
  },
  {
    id: 'bathroom',
    label: 'Bathroom',
    roomTypes: ['bathroom'],
    items: ['Bathtub', 'Shower Cabin', 'Toilet', 'Bathroom Sink', 'Heated Towel Rail', 'Backlit Mirror', 'Bathroom Shelf', 'Shower Curtain'],
  },
  {
    id: 'entryway',
    label: 'Entryway',
    roomTypes: ['entryway'],
    items: ['Coat Rack', 'Shoe Rack', 'Entry Bench', 'Umbrella Stand', 'Key Holder', 'Door Mat', 'Hallway Console'],
  },
  {
    id: 'office',
    label: 'Office',
    roomTypes: ['office'],
    items: ['Desk', 'Office Chair', 'Monitor', 'Computer', 'Keyboard', 'Mouse', 'Bookshelf', 'Notice Board'],
  },
  {
    id: 'balcony',
    label: 'Balcony',
    roomTypes: ['balcony'],
    items: ['Outdoor Chair', 'Outdoor Table', 'Planter', 'Lantern', 'Storage Chest'],
  },
  {
    id: 'lighting',
    label: 'Lighting',
    roomTypes: ['living-room', 'bedroom', 'kitchen', 'dining', 'office', 'entryway', 'bathroom'],
    items: ['Chandelier', 'Ceiling Light', 'Wall Lamp', 'Desk Lamp', 'Floor Lamp', 'Sconce', 'Night Light', 'Spotlight', 'LED Strip', 'Garland'],
  },
  {
    id: 'decor',
    label: 'Decor',
    roomTypes: ['living-room', 'bedroom', 'dining', 'entryway', 'office'],
    items: ['Painting', 'Poster', 'Photo Frame', 'Mirror', 'Panel Art', 'Tapestry', 'Vase', 'Figurine', 'Candle', 'Clock'],
  },
  {
    id: 'textiles',
    label: 'Textiles',
    roomTypes: ['living-room', 'bedroom', 'dining'],
    items: ['Rug', 'Runner', 'Decorative Cushion', 'Curtains', 'Blinds', 'Roman Shade', 'Plaid Throw', 'Tablecloth'],
  },
  {
    id: 'storage',
    label: 'Storage',
    roomTypes: ['living-room', 'bedroom', 'entryway', 'office'],
    items: ['Shelving Unit', 'Cabinet', 'Chest', 'Basket', 'Storage Box', 'Organizer', 'Side Cabinet'],
  },
  {
    id: 'climate-engineering',
    label: 'Climate & Engineering',
    roomTypes: ['living-room', 'bedroom', 'office', 'bathroom'],
    items: ['Air Conditioner', 'Heater', 'Fan', 'Humidifier', 'Radiator', 'Ventilation Grille', 'Water Purifier'],
  },
  {
    id: 'architectural-elements',
    label: 'Architectural Elements',
    roomTypes: ['living-room', 'bedroom', 'kitchen', 'dining', 'entryway', 'bathroom', 'office'],
    items: ['Door', 'Window', 'Stair', 'Molding', 'Baseboard', 'Cornice', 'Decorative Brick Panel', 'Switch Panel'],
  },
];

const FAMILY_SPECS = {
  sofa: { family: 'sofa', size: [2.6, 0.9, 1.05], description: 'Seating anchor for lounge layouts.' },
  armchair: { family: 'chair', size: [0.95, 0.95, 0.9], description: 'Accent seating for a reading or lounge area.' },
  chair: { family: 'chair', size: [0.58, 0.9, 0.58], description: 'Flexible chair that fits most layouts.' },
  table: { family: 'table', size: [1.5, 0.76, 0.9], description: 'Table surface for work, dining, or display.' },
  coffee: { family: 'table', size: [1.15, 0.45, 0.7], description: 'Low table for lounge layouts.' },
  cabinet: { family: 'cabinet', size: [1.8, 1.1, 0.55], description: 'Storage-focused casework item.' },
  wardrobe: { family: 'wardrobe', size: [1.8, 2.25, 0.65], description: 'Tall wardrobe with front door clearance.' },
  bookshelf: { family: 'shelf', size: [1.2, 2.1, 0.38], description: 'Vertical shelf for books and decor.' },
  shelf: { family: 'shelf', size: [1.2, 1.8, 0.38], description: 'Storage shelf for compact spaces.' },
  bed: { family: 'bed', size: [2, 0.72, 2.2], description: 'Primary bed element for sleep zones.' },
  mattress: { family: 'bed', size: [1.95, 0.28, 2.05], description: 'Mattress variant for bed setups.' },
  nightstand: { family: 'cabinet', size: [0.55, 0.58, 0.45], description: 'Small bedside table with storage.' },
  dresser: { family: 'cabinet', size: [1.4, 0.9, 0.5], description: 'Wide storage cabinet for folded items.' },
  vanity: { family: 'table', size: [1.1, 0.78, 0.5], description: 'Compact vanity or dressing table.' },
  desk: { family: 'desk', size: [1.4, 0.76, 0.72], description: 'Work surface for office and study layouts.' },
  television: { family: 'tv', size: [1.4, 0.9, 0.12], description: 'Screen element used for viewing-distance checks.' },
  tv: { family: 'tv', size: [1.4, 0.9, 0.12], description: 'Screen element used for viewing-distance checks.' },
  lamp: { family: 'lamp', size: [0.48, 1.75, 0.48], description: 'Light source for visual mood and accent.' },
  chandelier: { family: 'ceiling-light', size: [0.95, 0.48, 0.95], description: 'Statement ceiling-mounted light.' },
  ceiling: { family: 'ceiling-light', size: [0.8, 0.25, 0.8], description: 'General ceiling lighting fixture.' },
  wall: { family: 'wall-decor', size: [1.2, 0.1, 0.05], description: 'Wall-mounted decorative or lighting element.' },
  floor: { family: 'lamp', size: [0.45, 1.65, 0.45], description: 'Floor-standing lighting piece.' },
  mirror: { family: 'mirror', size: [0.85, 1.8, 0.08], description: 'Reflective vertical element that expands the room visually.' },
  bathtub: { family: 'bathtub', size: [1.7, 0.62, 0.82], description: 'Primary bathing fixture.' },
  shower: { family: 'shower', size: [1, 2.1, 1], description: 'Enclosed shower fixture.' },
  toilet: { family: 'toilet', size: [0.72, 0.76, 0.72], description: 'Bathroom sanitary fixture.' },
  sink: { family: 'sink', size: [0.9, 0.9, 0.58], description: 'Sink basin with vanity or pedestal.' },
  refrigerator: { family: 'appliance', size: [0.92, 1.95, 0.78], description: 'Tall kitchen appliance.' },
  cooktop: { family: 'appliance', size: [0.9, 0.9, 0.68], description: 'Cooking appliance.' },
  microwave: { family: 'appliance', size: [0.7, 0.42, 0.48], description: 'Countertop or built-in microwave appliance.' },
  dishwasher: { family: 'appliance', size: [0.6, 0.85, 0.62], description: 'Integrated kitchen appliance.' },
  hood: { family: 'wall-decor', size: [0.9, 0.7, 0.48], description: 'Kitchen hood element.' },
  island: { family: 'cabinet', size: [1.8, 0.92, 0.9], description: 'Freestanding kitchen island.' },
  plant: { family: 'plant', size: [0.55, 1.35, 0.55], description: 'Decorative indoor plant.' },
  rug: { family: 'rug', size: [2.3, 0.03, 1.6], description: 'Textile floor layer that defines a zone.' },
  curtain: { family: 'textile', size: [2.2, 2.6, 0.08], description: 'Window textile treatment.' },
  blind: { family: 'textile', size: [1.8, 2.2, 0.08], description: 'Compact window covering.' },
  radiator: { family: 'appliance', size: [1.1, 0.68, 0.14], description: 'Wall-adjacent heating element.' },
  air: { family: 'appliance', size: [1, 0.38, 0.24], description: 'Climate-control appliance.' },
  fan: { family: 'appliance', size: [0.48, 1.2, 0.48], description: 'Portable air circulation appliance.' },
  humidifier: { family: 'appliance', size: [0.35, 0.48, 0.35], description: 'Compact air moisture appliance.' },
  stair: { family: 'stair', size: [2.5, 2.8, 1], description: 'Vertical circulation element for houses.' },
  default: { family: 'decor', size: [0.9, 0.9, 0.45], description: 'Flexible interior element.' },
};

const FAMILY_VARIANT_PROFILES = {
  sofa: {
    Compact: { suffix: 'Loveseat', geometryKey: 'sofa-compact', multipliers: [0.8, 0.86, 0.82], silhouette: 'loveseat', material: 'woven fabric' },
    Standard: { suffix: 'Track Arm Sofa', geometryKey: 'sofa-track', multipliers: [1, 1, 1], silhouette: 'track-arm', material: 'oak and fabric' },
    Premium: { suffix: 'Deep Tuxedo Sofa', geometryKey: 'sofa-tuxedo', multipliers: [1.18, 1.08, 1.14], silhouette: 'tuxedo', material: 'walnut and boucle' },
    Minimal: { suffix: 'Armless Platform Sofa', geometryKey: 'sofa-minimal', multipliers: [0.94, 0.72, 0.92], silhouette: 'platform', material: 'powder-coated steel and linen' },
    Statement: { suffix: 'Curved Sofa', geometryKey: 'sofa-curved', multipliers: [1.1, 0.96, 1.02], silhouette: 'curved', material: 'velvet' },
  },
  chair: {
    Compact: { suffix: 'Slipper Chair', geometryKey: 'chair-slipper', multipliers: [0.86, 0.82, 0.82], silhouette: 'slipper', material: 'linen' },
    Standard: { suffix: 'Side Chair', geometryKey: 'chair-side', multipliers: [1, 1, 1], silhouette: 'side', material: 'oak' },
    Premium: { suffix: 'Wingback Chair', geometryKey: 'chair-wingback', multipliers: [1.08, 1.16, 1], silhouette: 'wingback', material: 'walnut and leather' },
    Minimal: { suffix: 'Wishbone Chair', geometryKey: 'chair-wishbone', multipliers: [0.94, 0.96, 0.92], silhouette: 'wishbone', material: 'ash wood' },
    Statement: { suffix: 'Barrel Chair', geometryKey: 'chair-barrel', multipliers: [1.02, 1.02, 1.08], silhouette: 'barrel', material: 'boucle' },
  },
  table: {
    Compact: { suffix: 'Drop-Leaf Table', geometryKey: 'table-drop-leaf', multipliers: [0.84, 1, 0.74], silhouette: 'drop-leaf', material: 'birch' },
    Standard: { suffix: 'Pedestal Table', geometryKey: 'table-pedestal', multipliers: [1, 1, 1], silhouette: 'pedestal', material: 'oak' },
    Premium: { suffix: 'Trestle Table', geometryKey: 'table-trestle', multipliers: [1.16, 1, 1.08], silhouette: 'trestle', material: 'walnut' },
    Minimal: { suffix: 'Parsons Table', geometryKey: 'table-parsons', multipliers: [0.96, 0.96, 0.92], silhouette: 'parsons', material: 'lacquered wood' },
    Statement: { suffix: 'Waterfall Table', geometryKey: 'table-waterfall', multipliers: [1.02, 0.9, 0.98], silhouette: 'waterfall', material: 'stone composite' },
  },
  cabinet: {
    Compact: { suffix: 'Two-Door Cabinet', geometryKey: 'cabinet-compact', multipliers: [0.82, 0.82, 0.86], silhouette: 'two-door', material: 'oak veneer' },
    Standard: { suffix: 'Flush Cabinet', geometryKey: 'cabinet-standard', multipliers: [1, 1, 1], silhouette: 'flush', material: 'oak' },
    Premium: { suffix: 'Fluted Sideboard', geometryKey: 'cabinet-fluted', multipliers: [1.18, 1.02, 1], silhouette: 'fluted', material: 'walnut' },
    Minimal: { suffix: 'Floating Cabinet', geometryKey: 'cabinet-floating', multipliers: [0.94, 0.8, 0.9], silhouette: 'floating', material: 'matte lacquer' },
    Statement: { suffix: 'Arched Cabinet', geometryKey: 'cabinet-arched', multipliers: [1.06, 1.16, 0.98], silhouette: 'arched', material: 'ribbed wood' },
  },
  wardrobe: {
    Compact: { suffix: 'Single Armoire', geometryKey: 'wardrobe-single', multipliers: [0.76, 0.96, 0.84], silhouette: 'single-armoire', material: 'painted wood' },
    Standard: { suffix: 'Double Wardrobe', geometryKey: 'wardrobe-double', multipliers: [1, 1, 1], silhouette: 'double-door', material: 'oak' },
    Premium: { suffix: 'Paneled Wardrobe', geometryKey: 'wardrobe-paneled', multipliers: [1.16, 1.05, 1], silhouette: 'paneled', material: 'walnut' },
    Minimal: { suffix: 'Sliding Wardrobe', geometryKey: 'wardrobe-sliding', multipliers: [1.02, 0.94, 0.88], silhouette: 'sliding', material: 'matte laminate' },
    Statement: { suffix: 'Rounded Wardrobe', geometryKey: 'wardrobe-rounded', multipliers: [1.08, 1.12, 0.98], silhouette: 'rounded', material: 'lacquer and brass' },
  },
  shelf: {
    Compact: { suffix: 'Cube Shelf', geometryKey: 'shelf-cube', multipliers: [0.84, 0.82, 0.86], silhouette: 'cube', material: 'oak veneer' },
    Standard: { suffix: 'Open Shelf', geometryKey: 'shelf-open', multipliers: [1, 1, 1], silhouette: 'open', material: 'oak' },
    Premium: { suffix: 'Ladder Shelf', geometryKey: 'shelf-ladder', multipliers: [1.02, 1.08, 0.92], silhouette: 'ladder', material: 'walnut' },
    Minimal: { suffix: 'Slim Shelf', geometryKey: 'shelf-slim', multipliers: [0.92, 0.96, 0.78], silhouette: 'slim', material: 'powder-coated steel' },
    Statement: { suffix: 'Asymmetric Shelf', geometryKey: 'shelf-asymmetric', multipliers: [1.08, 1.04, 0.96], silhouette: 'asymmetric', material: 'smoked oak' },
  },
  bed: {
    Compact: { suffix: 'Single Bed', geometryKey: 'bed-single', multipliers: [0.82, 0.74, 0.82], silhouette: 'single', material: 'painted wood' },
    Standard: { suffix: 'Platform Bed', geometryKey: 'bed-platform', multipliers: [1, 1, 1], silhouette: 'platform', material: 'oak' },
    Premium: { suffix: 'Sleigh Bed', geometryKey: 'bed-sleigh', multipliers: [1.16, 1.08, 1.1], silhouette: 'sleigh', material: 'walnut' },
    Minimal: { suffix: 'Low Tatami Bed', geometryKey: 'bed-low', multipliers: [0.96, 0.62, 0.94], silhouette: 'low', material: 'ash wood' },
    Statement: { suffix: 'Canopy Bed', geometryKey: 'bed-canopy', multipliers: [1.08, 1.72, 1.04], silhouette: 'canopy', material: 'black steel' },
  },
  desk: {
    Compact: { suffix: 'Writing Desk', geometryKey: 'desk-writing', multipliers: [0.84, 0.94, 0.78], silhouette: 'writing', material: 'oak veneer' },
    Standard: { suffix: 'Work Desk', geometryKey: 'desk-standard', multipliers: [1, 1, 1], silhouette: 'work', material: 'oak' },
    Premium: { suffix: 'Executive Desk', geometryKey: 'desk-executive', multipliers: [1.2, 1.02, 1.08], silhouette: 'executive', material: 'walnut and leather' },
    Minimal: { suffix: 'Trestle Desk', geometryKey: 'desk-trestle', multipliers: [0.96, 0.96, 0.9], silhouette: 'trestle', material: 'white oak' },
    Statement: { suffix: 'Waterfall Desk', geometryKey: 'desk-waterfall', multipliers: [1.02, 0.92, 0.96], silhouette: 'waterfall', material: 'stone laminate' },
  },
  tv: {
    Compact: { suffix: 'Slim TV', geometryKey: 'tv-slim', multipliers: [0.86, 0.82, 1], silhouette: 'slim', material: 'matte black' },
    Standard: { suffix: 'Flat Panel TV', geometryKey: 'tv-standard', multipliers: [1, 1, 1], silhouette: 'flat-panel', material: 'graphite' },
    Premium: { suffix: 'Gallery TV', geometryKey: 'tv-gallery', multipliers: [1.06, 1, 1], silhouette: 'gallery', material: 'graphite and brass' },
    Minimal: { suffix: 'Frame TV', geometryKey: 'tv-frame', multipliers: [0.94, 0.94, 1], silhouette: 'frame-tv', material: 'black aluminum' },
    Statement: { suffix: 'Curved TV', geometryKey: 'tv-curved', multipliers: [1.08, 1, 1], silhouette: 'curved-tv', material: 'gloss black' },
  },
  lamp: {
    Compact: { suffix: 'Pin Lamp', geometryKey: 'lamp-pin', multipliers: [0.76, 0.82, 0.76], silhouette: 'pin', material: 'painted steel' },
    Standard: { suffix: 'Drum Lamp', geometryKey: 'lamp-drum', multipliers: [1, 1, 1], silhouette: 'drum', material: 'linen shade' },
    Premium: { suffix: 'Arc Lamp', geometryKey: 'lamp-arc', multipliers: [1.18, 1.14, 1.1], silhouette: 'arc', material: 'brushed brass' },
    Minimal: { suffix: 'Tripod Lamp', geometryKey: 'lamp-tripod', multipliers: [0.96, 0.98, 0.96], silhouette: 'tripod', material: 'ash wood' },
    Statement: { suffix: 'Globe Lamp', geometryKey: 'lamp-globe', multipliers: [1.02, 1.06, 1.02], silhouette: 'globe', material: 'opal glass' },
  },
  'ceiling-light': {
    Compact: { suffix: 'Flush Mount', geometryKey: 'ceiling-flush', multipliers: [0.76, 0.74, 0.76], silhouette: 'flush', material: 'painted steel' },
    Standard: { suffix: 'Pendant Light', geometryKey: 'ceiling-pendant', multipliers: [1, 1, 1], silhouette: 'pendant', material: 'glass and steel' },
    Premium: { suffix: 'Tiered Chandelier', geometryKey: 'ceiling-tiered', multipliers: [1.22, 1.08, 1.22], silhouette: 'tiered', material: 'brass and glass' },
    Minimal: { suffix: 'Disc Pendant', geometryKey: 'ceiling-disc', multipliers: [0.94, 0.86, 0.94], silhouette: 'disc', material: 'matte aluminum' },
    Statement: { suffix: 'Sputnik Chandelier', geometryKey: 'ceiling-sputnik', multipliers: [1.18, 1.02, 1.18], silhouette: 'sputnik', material: 'brass' },
  },
  mirror: {
    Compact: { suffix: 'Round Mirror', geometryKey: 'mirror-round', multipliers: [0.82, 0.82, 1], silhouette: 'round', material: 'thin brass frame' },
    Standard: { suffix: 'Vertical Mirror', geometryKey: 'mirror-vertical', multipliers: [1, 1, 1], silhouette: 'vertical', material: 'oak frame' },
    Premium: { suffix: 'Backlit Mirror', geometryKey: 'mirror-backlit', multipliers: [1.08, 1.08, 1], silhouette: 'backlit', material: 'aluminum' },
    Minimal: { suffix: 'Frameless Mirror', geometryKey: 'mirror-frameless', multipliers: [0.96, 0.98, 1], silhouette: 'frameless', material: 'polished edge' },
    Statement: { suffix: 'Arch Mirror', geometryKey: 'mirror-arch', multipliers: [1.02, 1.14, 1], silhouette: 'arch', material: 'bronze frame' },
  },
  bathtub: {
    Compact: { suffix: 'Inset Tub', geometryKey: 'bathtub-inset', multipliers: [0.9, 0.88, 0.86], silhouette: 'inset', material: 'acrylic' },
    Standard: { suffix: 'Rectangular Tub', geometryKey: 'bathtub-rect', multipliers: [1, 1, 1], silhouette: 'rectangular', material: 'acrylic' },
    Premium: { suffix: 'Slipper Tub', geometryKey: 'bathtub-slipper', multipliers: [1.12, 1.06, 1], silhouette: 'slipper', material: 'stone resin' },
    Minimal: { suffix: 'Japanese Soaking Tub', geometryKey: 'bathtub-soaking', multipliers: [0.82, 1.08, 0.82], silhouette: 'soaking', material: 'composite stone' },
    Statement: { suffix: 'Oval Freestanding Tub', geometryKey: 'bathtub-oval', multipliers: [1.08, 1.02, 1.04], silhouette: 'oval', material: 'solid surface' },
  },
  shower: {
    Compact: { suffix: 'Corner Shower', geometryKey: 'shower-corner', multipliers: [0.82, 0.96, 0.82], silhouette: 'corner', material: 'glass' },
    Standard: { suffix: 'Glass Shower', geometryKey: 'shower-glass', multipliers: [1, 1, 1], silhouette: 'glass', material: 'glass and chrome' },
    Premium: { suffix: 'Rain Shower', geometryKey: 'shower-rain', multipliers: [1.08, 1.02, 1.02], silhouette: 'rain', material: 'brushed nickel' },
    Minimal: { suffix: 'Walk-In Shower', geometryKey: 'shower-walkin', multipliers: [0.96, 1, 0.9], silhouette: 'walk-in', material: 'frameless glass' },
    Statement: { suffix: 'Black Frame Shower', geometryKey: 'shower-blackframe', multipliers: [1.02, 1.04, 1], silhouette: 'black-frame', material: 'black steel and glass' },
  },
  toilet: {
    Compact: { suffix: 'Short Projection Toilet', geometryKey: 'toilet-compact', multipliers: [0.86, 0.9, 0.84], silhouette: 'short-projection', material: 'ceramic' },
    Standard: { suffix: 'Close-Coupled Toilet', geometryKey: 'toilet-standard', multipliers: [1, 1, 1], silhouette: 'close-coupled', material: 'ceramic' },
    Premium: { suffix: 'Comfort Height Toilet', geometryKey: 'toilet-comfort', multipliers: [1.02, 1.08, 1], silhouette: 'comfort-height', material: 'ceramic' },
    Minimal: { suffix: 'Wall-Hung Toilet', geometryKey: 'toilet-wallhung', multipliers: [0.92, 0.86, 0.86], silhouette: 'wall-hung', material: 'ceramic' },
    Statement: { suffix: 'Monoblock Toilet', geometryKey: 'toilet-monoblock', multipliers: [1.04, 1.02, 1.02], silhouette: 'monoblock', material: 'ceramic' },
  },
  sink: {
    Compact: { suffix: 'Pedestal Sink', geometryKey: 'sink-pedestal', multipliers: [0.82, 0.92, 0.82], silhouette: 'pedestal', material: 'ceramic' },
    Standard: { suffix: 'Vanity Sink', geometryKey: 'sink-vanity', multipliers: [1, 1, 1], silhouette: 'vanity', material: 'oak and ceramic' },
    Premium: { suffix: 'Double Vanity Sink', geometryKey: 'sink-double', multipliers: [1.18, 1.02, 1], silhouette: 'double-vanity', material: 'stone top' },
    Minimal: { suffix: 'Wall-Hung Sink', geometryKey: 'sink-wallhung', multipliers: [0.9, 0.9, 0.78], silhouette: 'wall-hung', material: 'matte ceramic' },
    Statement: { suffix: 'Vessel Sink', geometryKey: 'sink-vessel', multipliers: [1.02, 1.06, 0.92], silhouette: 'vessel', material: 'stone basin' },
  },
  appliance: {
    Compact: { suffix: 'Compact Appliance', geometryKey: 'appliance-compact', multipliers: [0.84, 0.86, 0.84], silhouette: 'compact', material: 'white enamel' },
    Standard: { suffix: 'Standard Appliance', geometryKey: 'appliance-standard', multipliers: [1, 1, 1], silhouette: 'standard', material: 'brushed steel' },
    Premium: { suffix: 'Panel-Ready Appliance', geometryKey: 'appliance-panel', multipliers: [1.04, 1.04, 1], silhouette: 'panel-ready', material: 'steel and glass' },
    Minimal: { suffix: 'Seamless Appliance', geometryKey: 'appliance-minimal', multipliers: [0.96, 0.94, 0.92], silhouette: 'seamless', material: 'matte graphite' },
    Statement: { suffix: 'Retro Appliance', geometryKey: 'appliance-retro', multipliers: [1.06, 1.08, 1.04], silhouette: 'retro', material: 'gloss enamel' },
  },
  plant: {
    Compact: { suffix: 'Desk Plant', geometryKey: 'plant-compact', multipliers: [0.72, 0.76, 0.72], silhouette: 'desk-plant', material: 'clay pot' },
    Standard: { suffix: 'Floor Plant', geometryKey: 'plant-standard', multipliers: [1, 1, 1], silhouette: 'floor-plant', material: 'ceramic pot' },
    Premium: { suffix: 'Olive Tree', geometryKey: 'plant-olive', multipliers: [1.12, 1.18, 1.02], silhouette: 'olive-tree', material: 'stone pot' },
    Minimal: { suffix: 'Single Stem Plant', geometryKey: 'plant-minimal', multipliers: [0.82, 1.02, 0.82], silhouette: 'single-stem', material: 'concrete pot' },
    Statement: { suffix: 'Fan Palm', geometryKey: 'plant-palm', multipliers: [1.08, 1.12, 1.08], silhouette: 'fan-palm', material: 'ribbed planter' },
  },
  rug: {
    Compact: { suffix: 'Runner Rug', geometryKey: 'rug-runner', multipliers: [0.72, 1, 0.62], silhouette: 'runner', material: 'flatweave' },
    Standard: { suffix: 'Rectangular Rug', geometryKey: 'rug-rect', multipliers: [1, 1, 1], silhouette: 'rectangular', material: 'woven wool' },
    Premium: { suffix: 'Layered Rug', geometryKey: 'rug-layered', multipliers: [1.1, 1, 1.06], silhouette: 'layered', material: 'hand-tufted wool' },
    Minimal: { suffix: 'Border Rug', geometryKey: 'rug-border', multipliers: [0.96, 1, 0.94], silhouette: 'border', material: 'cotton flatweave' },
    Statement: { suffix: 'Organic Rug', geometryKey: 'rug-organic', multipliers: [1.02, 1, 1.02], silhouette: 'organic', material: 'high-pile wool' },
  },
  textile: {
    Compact: { suffix: 'Compact Textile', geometryKey: 'textile-compact', multipliers: [0.84, 0.9, 0.82], silhouette: 'compact', material: 'cotton' },
    Standard: { suffix: 'Standard Textile', geometryKey: 'textile-standard', multipliers: [1, 1, 1], silhouette: 'standard', material: 'linen' },
    Premium: { suffix: 'Layered Textile', geometryKey: 'textile-layered', multipliers: [1.08, 1.04, 1.04], silhouette: 'layered', material: 'linen blend' },
    Minimal: { suffix: 'Panel Textile', geometryKey: 'textile-panel', multipliers: [0.96, 0.96, 0.9], silhouette: 'panel', material: 'sheer linen' },
    Statement: { suffix: 'Draped Textile', geometryKey: 'textile-draped', multipliers: [1.02, 1.08, 1.02], silhouette: 'draped', material: 'velvet' },
  },
  stair: {
    Compact: { suffix: 'Straight Stair', geometryKey: 'stair-straight', multipliers: [0.92, 0.92, 0.82], silhouette: 'straight', material: 'oak' },
    Standard: { suffix: 'Open Stair', geometryKey: 'stair-open', multipliers: [1, 1, 1], silhouette: 'open', material: 'oak and steel' },
    Premium: { suffix: 'Closed Stair', geometryKey: 'stair-closed', multipliers: [1.08, 1.02, 1], silhouette: 'closed', material: 'walnut' },
    Minimal: { suffix: 'Mono Stair', geometryKey: 'stair-mono', multipliers: [0.98, 1, 0.88], silhouette: 'mono-stringer', material: 'steel' },
    Statement: { suffix: 'Ribbon Stair', geometryKey: 'stair-ribbon', multipliers: [1.06, 1.04, 1.02], silhouette: 'ribbon', material: 'black steel' },
  },
  'wall-decor': {
    Compact: { suffix: 'Compact Wall Piece', geometryKey: 'wall-compact', multipliers: [0.8, 0.82, 0.8], silhouette: 'compact', material: 'painted MDF' },
    Standard: { suffix: 'Panel Piece', geometryKey: 'wall-standard', multipliers: [1, 1, 1], silhouette: 'panel', material: 'oak' },
    Premium: { suffix: 'Layered Wall Piece', geometryKey: 'wall-layered', multipliers: [1.1, 1.08, 1], silhouette: 'layered', material: 'walnut' },
    Minimal: { suffix: 'Slim Wall Piece', geometryKey: 'wall-minimal', multipliers: [0.96, 0.96, 0.76], silhouette: 'slim', material: 'matte metal' },
    Statement: { suffix: 'Arch Wall Piece', geometryKey: 'wall-arch', multipliers: [1.04, 1.12, 1], silhouette: 'arch', material: 'bronze' },
  },
  decor: {
    Compact: { suffix: 'Small Decor Accent', geometryKey: 'decor-compact', multipliers: [0.72, 0.78, 0.72], silhouette: 'small', material: 'ceramic' },
    Standard: { suffix: 'Decor Accent', geometryKey: 'decor-standard', multipliers: [1, 1, 1], silhouette: 'standard', material: 'glass' },
    Premium: { suffix: 'Layered Decor Accent', geometryKey: 'decor-layered', multipliers: [1.08, 1.08, 1.02], silhouette: 'layered', material: 'stone' },
    Minimal: { suffix: 'Monolith Decor Accent', geometryKey: 'decor-minimal', multipliers: [0.86, 1.04, 0.82], silhouette: 'monolith', material: 'travertine' },
    Statement: { suffix: 'Sculptural Decor Accent', geometryKey: 'decor-sculptural', multipliers: [1.04, 1.1, 1.04], silhouette: 'sculptural', material: 'colored glass' },
  },
};

function getFamilyVariantProfile(family, tier) {
  return FAMILY_VARIANT_PROFILES[family]?.[tier] ?? FAMILY_VARIANT_PROFILES.decor[tier];
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function inferSpec(label) {
  const lower = label.toLowerCase();
  const entries = Object.entries(FAMILY_SPECS).filter(([key]) => key !== 'default');
  for (const [key, spec] of entries) {
    if (lower.includes(key)) {
      return spec;
    }
  }
  return FAMILY_SPECS.default;
}

function createCatalogItem(category, label) {
  const spec = inferSpec(label);
  const id = slugify(label);
  const variants = VARIANT_TIERS.map((tier) => {
    const config = VARIANT_TIER_CONFIG[tier];
    const profile = getFamilyVariantProfile(spec.family, tier);
    return {
      id: `${id}-${slugify(tier)}`,
      tier,
      label: `${label} ${profile.suffix}`,
      size: spec.size.map((value, index) => Number((value * profile.multipliers[index]).toFixed(2))),
      silhouette: profile.silhouette,
      material: profile.material ?? config.material,
      assetKey: `${id}-${slugify(tier)}`,
      geometryKey: profile.geometryKey,
      profile,
      tierLabel: config.label,
      description: `${config.label} interpretation of ${label.toLowerCase()} with a ${profile.silhouette.replace(/-/g, ' ')} silhouette.`,
    };
  });

  return {
    id,
    label,
    categoryId: category.id,
    categoryLabel: category.label,
    roomTypes: category.roomTypes,
    family: spec.family,
    description: spec.description,
    defaultColor: COLOR_SWATCHES[Math.abs(id.length * 17) % COLOR_SWATCHES.length],
    variants,
  };
}

export const CATALOG_CATEGORIES = CATEGORY_DEFINITIONS;
export const CATALOG_ITEMS = CATEGORY_DEFINITIONS.flatMap((category) => category.items.map((label) => createCatalogItem(category, label)));
export const CATALOG_BY_ID = Object.fromEntries(CATALOG_ITEMS.map((item) => [item.id, item]));

function getCatalogItem(id) {
  return CATALOG_BY_ID[id] ?? CATALOG_ITEMS[0];
}

function getVariant(item, tier = 'Standard') {
  return item.variants.find((variant) => variant.tier === tier) ?? item.variants[1];
}

function createPlacedItem({ id, catalogId, tier = 'Standard', x, z, rotation = 0, color, locked = false, material }) {
  const catalogItem = getCatalogItem(catalogId);
  const variant = getVariant(catalogItem, tier);
  return {
    id,
    catalogId,
    variantId: variant.id,
    variantTier: variant.tier,
    family: catalogItem.family,
    label: variant.label,
    material: material ?? variant.material,
    color: color ?? catalogItem.defaultColor,
    x,
    z,
    rotation,
    locked,
    animation: null,
  };
}

function createRoom({ id, label, roomType, x, z, width, depth, height = 3, floorId, items = [], doors = [], windows = [] }) {
  return {
    id,
    label,
    roomType,
    floorId,
    x,
    z,
    width,
    depth,
    height,
    wallSegments: {
      north: [{ id: `${id}-north-0`, start: 0, length: width, solid: true }],
      east: [{ id: `${id}-east-0`, start: 0, length: depth, solid: true }],
      south: [{ id: `${id}-south-0`, start: 0, length: width, solid: true }],
      west: [{ id: `${id}-west-0`, start: 0, length: depth, solid: true }],
    },
    openings: { doors, windows },
    items,
  };
}

function createFloor(id, label, elevation, rooms) {
  return { id, label, elevation, rooms };
}

const TEMPLATE_LIBRARY = [
  {
    id: 'studio',
    label: 'Studio',
    propertyType: 'apartment',
    floors: [
      createFloor('floor-1', 'Floor 1', 0, [
        createRoom({
          id: 'studio-room',
          floorId: 'floor-1',
          label: 'Studio Living',
          roomType: 'studio',
          x: 0,
          z: 0,
          width: 8,
          depth: 6,
          items: [
            createPlacedItem({ id: 'studio-sofa', catalogId: 'sofa', x: 2.2, z: 2 }),
            createPlacedItem({ id: 'studio-tv', catalogId: 'television', x: 6.8, z: 2, rotation: Math.PI }),
            createPlacedItem({ id: 'studio-bed', catalogId: 'bed', x: 2.1, z: 4.8, rotation: Math.PI / 2 }),
            createPlacedItem({ id: 'studio-rug', catalogId: 'rug', tier: 'Minimal', x: 4.5, z: 2 }),
          ],
        }),
      ]),
    ],
  },
  {
    id: 'one-bedroom',
    label: '1-Bedroom',
    propertyType: 'apartment',
    floors: [
      createFloor('floor-1', 'Floor 1', 0, [
        createRoom({
          id: 'living',
          floorId: 'floor-1',
          label: 'Living Room',
          roomType: 'living-room',
          x: 0,
          z: 0,
          width: 6,
          depth: 5,
          items: [
            createPlacedItem({ id: 'living-sofa', catalogId: 'sofa', x: 1.8, z: 2 }),
            createPlacedItem({ id: 'living-tv', catalogId: 'television', x: 5.1, z: 2.1, rotation: Math.PI }),
            createPlacedItem({ id: 'living-table', catalogId: 'coffee-table', tier: 'Statement', x: 3, z: 2.4 }),
          ],
        }),
        createRoom({
          id: 'bedroom',
          floorId: 'floor-1',
          label: 'Bedroom',
          roomType: 'bedroom',
          x: 6.5,
          z: 0,
          width: 4.5,
          depth: 4.8,
          items: [
            createPlacedItem({ id: 'bed', catalogId: 'bed', x: 2.3, z: 2.2, rotation: Math.PI / 2 }),
            createPlacedItem({ id: 'nightstand', catalogId: 'nightstand', x: 1.1, z: 1.1 }),
            createPlacedItem({ id: 'wardrobe', catalogId: 'wardrobe', x: 4, z: 3.8, rotation: Math.PI }),
          ],
        }),
      ]),
    ],
  },
  {
    id: 'two-bedroom',
    label: '2-Bedroom',
    propertyType: 'apartment',
    floors: [
      createFloor('floor-1', 'Floor 1', 0, [
        createRoom({
          id: 'living-2b',
          floorId: 'floor-1',
          label: 'Living Room',
          roomType: 'living-room',
          x: 0,
          z: 0,
          width: 6,
          depth: 5,
          items: [
            createPlacedItem({ id: 'living-2b-sofa', catalogId: 'sofa', tier: 'Premium', x: 2, z: 2.1 }),
            createPlacedItem({ id: 'living-2b-tv', catalogId: 'television', x: 5.2, z: 2.1, rotation: Math.PI }),
          ],
        }),
        createRoom({
          id: 'bed-a',
          floorId: 'floor-1',
          label: 'Bedroom A',
          roomType: 'bedroom',
          x: 6.5,
          z: 0,
          width: 4.5,
          depth: 4.5,
          items: [createPlacedItem({ id: 'bed-a-bed', catalogId: 'bed', x: 2.2, z: 2.2, rotation: Math.PI / 2 })],
        }),
        createRoom({
          id: 'bed-b',
          floorId: 'floor-1',
          label: 'Bedroom B',
          roomType: 'bedroom',
          x: 6.5,
          z: 4.9,
          width: 4.5,
          depth: 4,
          items: [createPlacedItem({ id: 'bed-b-bed', catalogId: 'bed', tier: 'Compact', x: 2.1, z: 1.8, rotation: Math.PI / 2 })],
        }),
      ]),
    ],
  },
  {
    id: 'house-80',
    label: 'House 80 m²',
    propertyType: 'house',
    floors: [
      createFloor('floor-1', 'Ground Floor', 0, [
        createRoom({
          id: 'house80-living',
          floorId: 'floor-1',
          label: 'Living Room',
          roomType: 'living-room',
          x: 0,
          z: 0,
          width: 6,
          depth: 5,
          items: [
            createPlacedItem({ id: 'house80-sofa', catalogId: 'sofa', x: 2, z: 2.2 }),
            createPlacedItem({ id: 'house80-tv', catalogId: 'television', x: 5, z: 2.3, rotation: Math.PI }),
          ],
        }),
        createRoom({
          id: 'house80-kitchen',
          floorId: 'floor-1',
          label: 'Kitchen',
          roomType: 'kitchen',
          x: 6.4,
          z: 0,
          width: 4,
          depth: 4.5,
          items: [
            createPlacedItem({ id: 'house80-island', catalogId: 'kitchen-island', x: 2, z: 2.1 }),
            createPlacedItem({ id: 'house80-fridge', catalogId: 'refrigerator', x: 3.4, z: 0.8 }),
          ],
        }),
      ]),
      createFloor('floor-2', 'Upper Floor', 3.6, [
        createRoom({
          id: 'house80-bedroom',
          floorId: 'floor-2',
          label: 'Bedroom',
          roomType: 'bedroom',
          x: 0.6,
          z: 0,
          width: 5,
          depth: 4.8,
          items: [createPlacedItem({ id: 'house80-bed', catalogId: 'bed', x: 2.4, z: 2.4, rotation: Math.PI / 2 })],
        }),
        createRoom({
          id: 'house80-hall',
          floorId: 'floor-2',
          label: 'Hall',
          roomType: 'entryway',
          x: 5.9,
          z: 0,
          width: 3.2,
          depth: 3.2,
          items: [createPlacedItem({ id: 'house80-stair', catalogId: 'stair', x: 1.6, z: 1.5 })],
        }),
      ]),
    ],
  },
  {
    id: 'house-120',
    label: 'House 120 m²',
    propertyType: 'house',
    floors: [
      createFloor('floor-1', 'Ground Floor', 0, [
        createRoom({
          id: 'house120-lounge',
          floorId: 'floor-1',
          label: 'Lounge',
          roomType: 'living-room',
          x: 0,
          z: 0,
          width: 7,
          depth: 5.5,
          items: [
            createPlacedItem({ id: 'house120-sofa', catalogId: 'sofa', tier: 'Statement', x: 2.2, z: 2.6 }),
            createPlacedItem({ id: 'house120-tv', catalogId: 'television', x: 6, z: 2.7, rotation: Math.PI }),
            createPlacedItem({ id: 'house120-armchair', catalogId: 'armchair', x: 2.1, z: 4.3 }),
          ],
        }),
        createRoom({
          id: 'house120-kitchen',
          floorId: 'floor-1',
          label: 'Kitchen Dining',
          roomType: 'kitchen-living-room',
          x: 7.4,
          z: 0,
          width: 5.6,
          depth: 5.5,
          items: [
            createPlacedItem({ id: 'house120-island', catalogId: 'kitchen-island', tier: 'Premium', x: 2.5, z: 2.4 }),
            createPlacedItem({ id: 'house120-dining', catalogId: 'dining-table', tier: 'Premium', x: 4.6, z: 4.2 }),
          ],
        }),
      ]),
      createFloor('floor-2', 'Upper Floor', 3.8, [
        createRoom({
          id: 'house120-master',
          floorId: 'floor-2',
          label: 'Master Bedroom',
          roomType: 'bedroom',
          x: 0.6,
          z: 0,
          width: 5.5,
          depth: 4.8,
          items: [
            createPlacedItem({ id: 'house120-bed', catalogId: 'bed', tier: 'Premium', x: 2.7, z: 2.3, rotation: Math.PI / 2 }),
            createPlacedItem({ id: 'house120-wardrobe', catalogId: 'wardrobe', x: 5.1, z: 4.1, rotation: Math.PI }),
          ],
        }),
        createRoom({
          id: 'house120-office',
          floorId: 'floor-2',
          label: 'Office',
          roomType: 'office',
          x: 6.5,
          z: 0,
          width: 4.6,
          depth: 4.2,
          items: [
            createPlacedItem({ id: 'house120-desk', catalogId: 'desk', x: 2.2, z: 1.5 }),
            createPlacedItem({ id: 'house120-chair', catalogId: 'office-chair', x: 2.2, z: 2.4 }),
          ],
        }),
      ]),
    ],
  },
  {
    id: 'office-template',
    label: 'Office',
    propertyType: 'apartment',
    floors: [
      createFloor('floor-1', 'Floor 1', 0, [
        createRoom({
          id: 'office-template-room',
          floorId: 'floor-1',
          label: 'Office',
          roomType: 'office',
          x: 0,
          z: 0,
          width: 6,
          depth: 4.8,
          items: [
            createPlacedItem({ id: 'office-template-desk', catalogId: 'desk', x: 2.6, z: 1.5 }),
            createPlacedItem({ id: 'office-template-chair', catalogId: 'office-chair', x: 2.6, z: 2.5 }),
            createPlacedItem({ id: 'office-template-monitor', catalogId: 'monitor', x: 2.6, z: 1.2 }),
          ],
        }),
      ]),
    ],
  },
  {
    id: 'bedroom-template',
    label: 'Bedroom',
    propertyType: 'apartment',
    floors: [
      createFloor('floor-1', 'Floor 1', 0, [
        createRoom({
          id: 'bedroom-template-room',
          floorId: 'floor-1',
          label: 'Bedroom',
          roomType: 'bedroom',
          x: 0,
          z: 0,
          width: 5,
          depth: 4.5,
          items: [
            createPlacedItem({ id: 'bedroom-template-bed', catalogId: 'bed', tier: 'Minimal', x: 2.3, z: 2.1, rotation: Math.PI / 2 }),
            createPlacedItem({ id: 'bedroom-template-mirror', catalogId: 'mirror', x: 4.5, z: 2.9, rotation: -Math.PI / 2 }),
          ],
        }),
      ]),
    ],
  },
  {
    id: 'kitchen-living-room',
    label: 'Kitchen-Living Room',
    propertyType: 'apartment',
    floors: [
      createFloor('floor-1', 'Floor 1', 0, [
        createRoom({
          id: 'klr-room',
          floorId: 'floor-1',
          label: 'Kitchen-Living Room',
          roomType: 'kitchen-living-room',
          x: 0,
          z: 0,
          width: 9,
          depth: 5.5,
          items: [
            createPlacedItem({ id: 'klr-sofa', catalogId: 'sofa', x: 2.1, z: 2.3 }),
            createPlacedItem({ id: 'klr-tv', catalogId: 'television', x: 4.8, z: 2.3, rotation: Math.PI }),
            createPlacedItem({ id: 'klr-island', catalogId: 'kitchen-island', x: 7, z: 2.1 }),
            createPlacedItem({ id: 'klr-stools', catalogId: 'bar-stool', x: 7, z: 3.2 }),
          ],
        }),
      ]),
    ],
  },
];

export const TEMPLATES = TEMPLATE_LIBRARY;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createVariant(id, label, baseTemplate) {
  return {
    id,
    label,
    stylePresetId: 'minimal',
    lightingScenarioId: 'day',
    activeFloorId: baseTemplate.floors[0]?.id ?? 'floor-1',
    floors: clone(baseTemplate.floors),
  };
}

export function getTemplate(templateId) {
  return TEMPLATES.find((template) => template.id === templateId) ?? TEMPLATES[0];
}

export function getTemplatesByPropertyType(propertyType) {
  return TEMPLATES.filter((template) => template.propertyType === propertyType);
}

export function createProjectFromTemplate(templateId, propertyType = 'apartment') {
  const template = getTemplate(templateId);
  const actualType = template.propertyType ?? propertyType;
  return {
    id: `project-${template.id}`,
    label: `${template.label} Demo`,
    propertyType: actualType,
    templateId: template.id,
    variants: [
      createVariant('A', 'Option A', template),
      createVariant('B', 'Option B', template),
    ],
  };
}

export function getStylePreset(stylePresetId) {
  return STYLE_PRESETS.find((preset) => preset.id === stylePresetId) ?? STYLE_PRESETS[0];
}

export function getLightingScenario(lightingScenarioId) {
  return LIGHTING_SCENARIOS.find((scenario) => scenario.id === lightingScenarioId) ?? LIGHTING_SCENARIOS[0];
}

export function getRoomArea(room) {
  return Number((room.width * room.depth).toFixed(1));
}

export function getCatalogFamilies() {
  return Array.from(new Set(CATALOG_ITEMS.map((item) => item.family)));
}
