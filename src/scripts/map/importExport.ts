import { addCity } from '../../data/collections/cities';
import { addMonument } from '../../data/collections/monuments';
import { addSubmonument } from '../../data/collections/submonuments';
import { addTour } from '../../data/collections/tours';
import { addExtendedTour } from '../../data/collections/extendedTours';
import { addRoute } from '../../data/collections/routes';

const importers = {
  cities: addCity,
  monuments: addMonument,
  submonuments: addSubmonument,
  tours: addTour,
  extendedTours: addExtendedTour,
  routes: addRoute,
};

export const setupImportExport = () => {
  const exportBtn = document.getElementById('export-btn');
  const importBtn = document.getElementById('import-btn');
  const importFile = document.getElementById('import-file');

  exportBtn.addEventListener('click', async () => {
    const allFeatures = {};
    for (const type of ['cities', 'monuments', 'submonuments', 'tours', 'extendedTours', 'routes']) {
      const module = await import(`../../data/collections/${type}`);
      allFeatures[type] = await module[`get${type.charAt(0).toUpperCase() + type.slice(1)}`]();
    }

    const json = JSON.stringify(allFeatures, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heritage-map-data-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    window.dispatchEvent(new CustomEvent('showStatus', {
      detail: { message: 'Data exported successfully.', type: 'success' },
    }));
  });

  importBtn.addEventListener('click', () => {
    importFile.click();
  });

  importFile.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result);
        for (const [type, features] of Object.entries(data)) {
          const addFeature = importers[type];
          if (addFeature) {
            for (const feature of features) {
              await addFeature(feature);
            }
          }
        }
        window.dispatchEvent(new CustomEvent('showStatus', {
          detail: { message: 'Data imported successfully.', type: 'success' },
        }));
      } catch (error) {
        window.dispatchEvent(new CustomEvent('showStatus', {
          detail: { message: 'Failed to import data.', type: 'error' },
        }));
      }
    };
    reader.readAsText(file);
  });
};