const { Schema } = require("mongoose");
const { geoPointSchema } = require("./geo-point.schama");

const mapLocationSchema = new Schema(
  {
    name: String,

    fullAddress: String,

    location: {
      type: geoPointSchema,
      index: "2dsphere",
    },

    locationId: String,
  },
  { _id: false, versionKey: false }
);

module.exports = {
  mapLocationSchema,
};
