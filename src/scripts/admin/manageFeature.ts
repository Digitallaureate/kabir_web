import { citySchema } from '../../data/schemas/citySchema';
import { monumentSchema } from '../../data/schemas/monumentSchema';
import { submonumentSchema } from '../../data/schemas/submonumentSchema';
import { tourSchema } from '../../data/schemas/tourSchema';
import { extendedTourSchema } from '../../data/schemas/extendedTourSchema';
import { routeSchema } from '../../data/schemas/routeSchema';
import { addCity, updateCity, deleteCity } from '../../data/collections/cities';
import { addMonument, updateMonument, deleteMonument } from '../../data/collections/monuments';
import { addSubmonument, updateSubmonument, deleteSubmonument } from '../../data/collections/submonuments';
import { addTour, updateTour, deleteTour } from '../../data/collections/tours';
import { addExtendedTour, updateExtendedTour, deleteExtendedTour } from '../../data/collections/extendedTours';
import { addRoute, updateRoute, deleteRoute } from '../../data/collections/routes';

const schemas = {
  city: citySchema,
  monument: monumentSchema,
  submonument: submonumentSchema,
  tour: tourSchema,
  extendedTour: extendedTourSchema,
  route: routeSchema,
};

const actions = {
  city: { add: addCity, update: updateCity, delete: deleteCity },
  monument: { add: addMonument, update: updateMonument, delete: deleteMonument },
  submonument: { add: addSubmonument, update: updateSubmonument, delete: deleteSubmonument },
  tour: { add: addTour, update: updateTour, delete: deleteTour },
  extendedTour: { add: addExtendedTour, update: updateExtendedTour, delete: deleteExtendedTour },
  route: { add: addRoute, update: updateRoute, delete: deleteRoute },
};

export const manageFeatures = (map, drawnItems) => {
  let allFeatures = {
    cities: [],
    monuments: [],
    submonuments: [],
    tours: [],
    extendedTours: [],
    routes: [],
  };
  let activeTab = 'cities';
  let isPickingCoordinates = false;

  const featureForm = document.getElementById('feature-form');
  const featureList = document.getElementById('feature-list');
  const addFeatureBtn = document.getElementById('add-feature-btn');

  // Update feature list when tab changes
  window.addEventListener('tabChange', (e) => {
    activeTab = e.detail;
    featureList.setAttribute('data-type', activeTab);
    featureList.setAttribute('data-features', JSON.stringify(allFeatures[activeTab]));
  });

  // Update feature list data
  const updateFeatureList = () => {
    featureList.setAttribute('data-features', JSON.stringify(allFeatures[activeTab]));
  };

  // Subscribe to Firestore collections
  Object.keys(allFeatures).forEach((type) => {
    import(`../../data/collections/${type}`).then((module) => {
      module[`subscribeTo${type.charAt(0).toUpperCase() + type.slice(1)}`]((data) => {
        allFeatures[type] = data;
        if (type === activeTab) updateFeatureList();
      });
    });
  });

  // Open form to add new feature
  addFeatureBtn.addEventListener('click', () => {
    featureForm.setAttribute('data-type', activeTab);
    featureForm.setAttribute('data-cities', JSON.stringify(allFeatures.cities));
    featureForm.setAttribute('data-monuments', JSON.stringify(allFeatures.monuments));
    featureForm.style.display = 'block';
  });

  // Handle form submission
  window.addEventListener('formSubmit', async (e) => {
    const { data, type } = e.detail;
    const schema = schemas[type];
    const action = actions[type];
    const errors = schema.validate(data);

    if (errors.length > 0) {
      window.dispatchEvent(new CustomEvent('showStatus', {
        detail: { message: errors.join(' '), type: 'error' },
      }));
      return;
    }

    try {
      if (data.id) {
        await action.update(data.id, data);
        window.dispatchEvent(new CustomEvent('showStatus', {
          detail: { message: 'Feature updated successfully.', type: 'success' },
        }));
      } else {
        await action.add(data);
        window.dispatchEvent(new CustomEvent('showStatus', {
          detail: { message: 'Feature added successfully.', type: 'success' },
        }));
      }
      featureForm.style.display = 'none';
    } catch (error) {
      window.dispatchEvent(new CustomEvent('showStatus', {
        detail: { message: 'Failed to save feature.', type: 'error' },
      }));
    }
  });

  // Handle form cancellation
  window.addEventListener('formCancel', () => {
    featureForm.style.display = 'none';
    isPickingCoordinates = false;
  });

  // Handle edit feature
  window.addEventListener('edit', (e) => {
    const id = e.detail;
    const feature = allFeatures[activeTab].find((f) => f.id === id);
    featureForm.setAttribute('data-feature', JSON.stringify(feature));
    featureForm.setAttribute('data-type', activeTab);
    featureForm.setAttribute('data-cities', JSON.stringify(allFeatures.cities));
    featureForm.setAttribute('data-monuments', JSON.stringify(allFeatures.monuments));
    featureForm.style.display = 'block';
  });

  // Handle delete feature
  window.addEventListener('delete', async (e) => {
    const id = e.detail;
    if (confirm('Are you sure you want to delete this feature?')) {
      try {
        await actions[activeTab].delete(id);
        window.dispatchEvent(new CustomEvent('showStatus', {
          detail: { message: 'Feature deleted successfully.', type: 'success' },
        }));
      } catch (error) {
        window.dispatchEvent(new CustomEvent('showStatus', {
          detail: { message: 'Failed to delete feature.', type: 'error' },
        }));
      }
    }
  });

  // Handle coordinate picking from map
  window.addEventListener('pickCoordinates', () => {
    isPickingCoordinates = true;
    window.dispatchEvent(new CustomEvent('showStatus', {
      detail: { message: 'Click on the map to pick coordinates.', type: 'info' },
    }));
  });

  map.on('click', (e) => {
    if (isPickingCoordinates) {
      const { lat, lng } = e.latlng;
      document.getElementById('feature-lat').value = lat.toFixed(6);
      document.getElementById('feature-lng').value = lng.toFixed(6);
      isPickingCoordinates = false;
      window.dispatchEvent(new CustomEvent('showStatus', {
        detail: { message: 'Coordinates picked.', type: 'success' },
      }));
    }
  });
};