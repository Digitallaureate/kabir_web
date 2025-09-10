export const monumentSchema = {
  validate: (data) => {
    const errors = [];

    if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
      errors.push('Name is required and must be a non-empty string.');
    }

    if (typeof data.lat !== 'number' || data.lat < -90 || data.lat > 90) {
      errors.push('Latitude must be a number between -90 and 90.');
    }

    if (typeof data.lng !== 'number' || data.lng < -180 || data.lng > 180) {
      errors.push('Longitude must be a number between -180 and 180.');
    }

    if (!data.city || typeof data.city !== 'string' || data.city.trim() === '') {
      errors.push('City reference is required and must be a non-empty string.');
    }

    if (data.description && typeof data.description !== 'string') {
      errors.push('Description must be a string if provided.');
    }

    return errors;
  },
};