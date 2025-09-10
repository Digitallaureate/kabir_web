export const extendedTourSchema = {
  validate: (data) => {
    const errors = [];

    if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
      errors.push('Name is required and must be a non-empty string.');
    }

    if (!Array.isArray(data.points) || data.points.length < 2) {
      errors.push('Points must be an array with at least 2 coordinates.');
    } else {
      data.points.forEach((point, index) => {
        if (Array.isArray(point)) {
          if (point.length !== 2 || typeof point[0] !== 'number' || typeof point[1] !== 'number') {
            errors.push(`Point at index ${index} must be an array of [lat, lng].`);
          }
          if (point[0] < -90 || point[0] > 90) {
            errors.push(`Latitude at index ${index} must be between -90 and 90.`);
          }
          if (point[1] < -180 || point[1] > 180) {
            errors.push(`Longitude at index ${index} must be between -180 and 180.`);
          }
        } else if (typeof point === 'object' && point.lat && point.lng) {
          if (typeof point.lat !== 'number' || point.lat < -90 || point.lat > 90) {
            errors.push(`Latitude at index ${index} must be a number between -90 and 90.`);
          }
          if (typeof point.lng !== 'number' || point.lng < -180 || point.lng > 180) {
            errors.push(`Longitude at index ${index} must be a number between -180 and 180.`);
          }
        } else {
          errors.push(`Point at index ${index} must be in format [lat, lng] or {lat, lng}.`);
        }
      });
    }

    if (data.description && typeof data.description !== 'string') {
      errors.push('Description must be a string if provided.');
    }

    return errors;
  },
};