const { Schema } = require("mongoose");

const SCHEMA_OPTIONS = {
  _id: false,
  versionKey: false,
};

const COMPLETE_FILE_RECORD = {
  name: String,
  link: String,
  size: Number,
  mime: String,
  metadata: {},
  id: String,
};

const LINK_FILE_RECORD = String;

const fileRecordSchema = new Schema(COMPLETE_FILE_RECORD, SCHEMA_OPTIONS);

module.exports = {
  fileRecordSchema,
};
