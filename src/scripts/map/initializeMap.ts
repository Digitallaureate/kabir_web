import { getZoomLevel } from '../../lib/leaflet';

export const initializeMap = (map, layers) => {
  // Handle zoom changes
  window.addEventListener('zoomChange', (e) => {
    const zoomLevel = e.detail;
    const zoom = getZoomLevel(zoomLevel);
    map.setZoom(zoom);

    // Update active zoom button
    document.querySelectorAll('.zoom-btn').forEach((btn) => {
      btn.classList.remove('active');
      if (btn.dataset.zoom === zoomLevel) {
        btn.classList.add('active');
      }
    });
  });

  // Handle layer toggling
  window.addEventListener('layerToggle', (e) => {
    const { layer, visible } = e.detail;
    const layerGroup = layers[layer];
    if (visible) {
      layerGroup.addTo(map);
    } else {
      map.removeLayer(layerGroup);
    }
  });

  // Update zoom button on manual zoom
  map.on('zoomend', () => {
    const currentZoom = map.getZoom();
    const zoomLevels = { city: 11, monument: 14, street: 17 };
    let activeLevel = 'city';
    if (currentZoom >= zoomLevels.street) activeLevel = 'street';
    else if (currentZoom >= zoomLevels.monument) activeLevel = 'monument';

    document.querySelectorAll('.zoom-btn').forEach((btn) => {
      btn.classList.remove('active');
      if (btn.dataset.zoom === activeLevel) {
        btn.classList.add('active');
      }
    });
  });
};