function toGeoPointsSetterFn(coords) {
  const geoCoords = coords?.latitude && coords?.longitude ? [coords.longitude, coords.latitude] : 0;

  return {
    coordinates: geoCoords,
  };
}

function toGeoJSONGetterFn(location) {
  if (!location || !location.coordinates) {
    return;
  }

  return {
    latitude: location.coordinates?.[1],
    longitude: location.coordinates?.[0],
  };
}

const jsonTransformer = (_doc, retDoc) => toGeoJSONGetterFn(retDoc);

module.exports = {
  toGeoPointsSetterFn,
  toGeoJSONGetterFn,
  jsonTransformer,
};
