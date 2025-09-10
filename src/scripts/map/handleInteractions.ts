export const handleInteractions = (map, layers) => {
  const infoPanel = document.getElementById('info-panel');

  // Show feature details on click
  const showFeatureDetails = (feature, type) => {
    infoPanel.setAttribute('data-feature', JSON.stringify(feature));
    infoPanel.setAttribute('data-type', type);
    infoPanel.style.display = 'block';
  };

  // Add click listeners to all layers
  Object.values(layers).forEach((layerGroup) => {
    layerGroup.on('click', (e) => {
      const feature = e.layer.data || e.target.data;
      const type = Object.keys(layers).find((key) => layers[key] === layerGroup);
      showFeatureDetails(feature, type);
    });
  });

  // Close info panel
  document.getElementById('close-info')?.addEventListener('click', () => {
    infoPanel.style.display = 'none';
  });
};