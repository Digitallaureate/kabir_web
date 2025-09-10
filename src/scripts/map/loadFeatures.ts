import { addMarker, addPolyline } from '../../lib/leaflet';

export const loadFeatures = (map, layers, subscriptions) => {
  const updateLayer = (layerGroup, data, type, addFunction) => {
    layerGroup.clearLayers();
    data.forEach((item) => addFunction(layerGroup, item, type));
  };

  subscriptions.subscribeToCities((cities) => {
    updateLayer(layers.cities, cities, 'city', addMarker);
  });

  subscriptions.subscribeToMonuments((monuments) => {
    updateLayer(layers.monuments, monuments, 'monument', addMarker);
  });

  subscriptions.subscribeToSubmonuments((submonuments) => {
    updateLayer(layers.submonuments, submonuments, 'submonument', addMarker);
  });

  subscriptions.subscribeToTours((tours) => {
    updateLayer(layers.tours, tours, 'tour', addPolyline);
  });

  subscriptions.subscribeToExtendedTours((extendedTours) => {
    updateLayer(layers.extendedTours, extendedTours, 'extendedTour', addPolyline);
  });

  subscriptions.subscribeToRoutes((routes) => {
    updateLayer(layers.routes, routes, 'route', addPolyline);
  });
};