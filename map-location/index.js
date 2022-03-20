const { toGeoJSONGetterFn } = require("./map-location.methods");

module.exports = {
  ...require("./map-location.schema"),
  ...require("./geo-point.schama"),
  toGeoJSON: toGeoJSONGetterFn,
};
