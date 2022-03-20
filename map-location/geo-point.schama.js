const { Schema } = require("mongoose");
const {
  jsonTransformer,
  toGeoJSONGetterFn,
  toGeoPointsSetterFn,
} = require("./map-location.methods");

const SCHEMA_FIELDS = {
  type: {
    type: String,
    default: "Point",
  },

  coordinates: {
    type: [Number],
    required: true,
  },
};

const SCHEMA_OPTIONS = {
  _id: false,
  toJSON: {
    getters: true,
    transform: jsonTransformer,
  },
  toObject: {
    getters: true,
    transform: jsonTransformer,
  },
  versionKey: false,
};

const geoPointSchema = new Schema(SCHEMA_FIELDS, SCHEMA_OPTIONS);

function GeoPointSchemaFactory(isRequired = true) {
  return {
    type: geoPointSchema,
    required: isRequired,
    index: "2dsphere",
    set: toGeoPointsSetterFn,
    get: toGeoJSONGetterFn,
  };
}

module.exports = {
  geoPointSchema,
  GeoPointSchemaFactory,
};
