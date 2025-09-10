import L from 'leaflet';
import 'leaflet-draw';

// Default center for the map (Agra, India)
const DEFAULT_CENTER = [27.1767, 78.0081];
const DEFAULT_ZOOM = 13;

// Zoom levels for different views
const ZOOM_LEVELS = {
  city: 11,
  monument: 14,
  street: 17,
};

// Custom marker icons
const ICONS = {
  city: L.divIcon({
    className: 'custom-marker',
    html: '<div class="marker-circle" style="background-color: #d4af37;"></div>',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  }),
  monument: L.divIcon({
    className: 'custom-marker',
    html: '<div class="marker-circle" style="background-color: #a0522d;"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  }),
  submonument: L.divIcon({
    className: 'custom-marker',
    html: '<div class="marker-circle" style="background-color: #4682b4;"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  }),
};

// Initialize the map
export const initializeMap = (mapId) => {
  const map = L.map(mapId, {
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    zoomControl: false,
  });

  // Add OpenStreetMap tiles with sepia filter
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    className: 'sepia-tiles',
  }).addTo(map);

  return map;
};

// Initialize layer groups
export const initializeLayers = (map) => {
  const layers = {
    cities: L.layerGroup().addTo(map),
    monuments: L.layerGroup().addTo(map),
    submonuments: L.layerGroup().addTo(map),
    tours: L.layerGroup().addTo(map),
    extendedTours: L.layerGroup().addTo(map),
    routes: L.layerGroup().addTo(map),
  };
  return layers;
};

// Add a marker to the map
export const addMarker = (layerGroup, data, type) => {
  const marker = L.marker([data.lat, data.lng], {
    icon: ICONS[type],
  }).bindPopup(`<b>${data.name || 'Unnamed'}</b><br>Type: ${type}`);
  marker.data = data;
  marker.addTo(layerGroup);
  return marker;
};

// Add a polyline to the map
export const addPolyline = (layerGroup, data, type) => {
  const color = {
    tours: '#2d5016',
    extendedTours: '#8b4513',
    routes: '#800080',
  }[type] || '#000000';

  const points = data.points.map((pt) => Array.isArray(pt) ? pt : [pt.lat, pt.lng]);
  const polyline = L.polyline(points, {
    color,
    weight: 4,
    opacity: 0.7,
  }).bindPopup(`<b>${data.name || 'Unnamed'}</b><br>Type: ${type}`);
  polyline.data = data;
  polyline.addTo(layerGroup);
  return polyline;
};

// Initialize Leaflet Draw for polylines
export const initializeDraw = (map, drawnItems) => {
  const drawControl = new L.Control.Draw({
    draw: {
      marker: false,
      polygon: false,
      rectangle: false,
      circle: false,
      circlemarker: false,
      polyline: {
        shapeOptions: {
          color: '#800080',
          weight: 4,
        },
      },
    },
    edit: {
      featureGroup: drawnItems,
      edit: true,
      remove: true,
    },
  });
  map.addControl(drawControl);
  return drawControl;
};

// Get zoom level value
export const getZoomLevel = (level) => ZOOM_LEVELS[level] || DEFAULT_ZOOM;

export { DEFAULT_CENTER, DEFAULT_ZOOM, ZOOM_LEVELS };