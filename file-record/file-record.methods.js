const { contentType } = require("mime-types");
const { basename, extname } = require("path");
const { v4: uuid } = require("uuid");

class FileRecord {
  constructor(name = "", link = "", size = 0, mime = "", metadata = {}, id = "") {
    this.name = name;

    this.link = link;

    this.size = size;

    this.mime = mime;

    this.metadata = metadata;

    this.id = id;
  }
}

function FileRecordFactory(file) {
  return new FileRecord(
    file.originalname,
    file.location || file.path,
    file.size,
    file.mimetype,
    file.hasOwnProperty("metadata") ? file.metadata : {},
    uuid()
  );
}

function toCompleteFileRecordSchema(fileOrFilesList) {
  if (Array.isArray(fileOrFilesList)) {
    return fileOrFilesList.map((f) => FileRecordFactory(f));
  }

  return FileRecordFactory(fileOrFilesList);
}

function toFileRecordSchema(fileOrFilesList, completeRecord = false) {
  if (completeRecord) {
    return toCompleteFileRecordSchema(fileOrFilesList);
  }

  if (Array.isArray(fileOrFilesList)) {
    return fileOrFilesList.map((f) => f.location || f.path);
  }

  return fileOrFilesList.location || fileOrFilesList.path;
}

function toFileRecordSchemaFromLink(link, metadata = {}) {
  const mimeType = contentType(extname(link));
  const fileName = basename(link, extname(link));

  return FileRecordFactory({
    originalname: fileName || "",
    location: link,
    size: -1,
    mime: mimeType,
    metadata,
  });
}

module.exports = {
  toFileRecordSchemaFromLink,
  toFileRecordSchema,
  toCompleteFileRecordSchema,
};
