export const setupDrawing = (map, drawnItems, drawControl) => {
  let isDrawing = false;
  const points = [];

  window.addEventListener('toggleDrawing', (e) => {
    isDrawing = e.detail;
    if (isDrawing) {
      new L.Draw.Polyline(map, drawControl.options.draw.polyline).enable();
    } else {
      map.eachLayer((layer) => {
        if (layer instanceof L.Draw.Polyline) {
          layer.disable();
        }
      });
    }
  });

  map.on('draw:created', (e) => {
    const layer = e.layer;
    drawnItems.addLayer(layer);
    const coords = layer.getLatLngs().map((latlng) => [latlng.lat, latlng.lng]);
    document.getElementById('feature-points').value = JSON.stringify(coords, null, 2);
  });

  map.on('draw:edited', (e) => {
    const layers = e.layers;
    layers.eachLayer((layer) => {
      const coords = layer.getLatLngs().map((latlng) => [latlng.lat, latlng.lng]);
      document.getElementById('feature-points').value = JSON.stringify(coords, null, 2);
    });
  });

  map.on('draw:deleted', () => {
    document.getElementById('feature-points').value = '[]';
  });
};