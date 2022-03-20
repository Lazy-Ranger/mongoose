const { Types } = require("mongoose");
const { isNotEmptyObject } = require("../../../utils");

function getCollectionName(model) {
  return model.collection.collectionName;
}

function toObjectId(idOrObject) {
  let objectId;

  if (isNotEmptyObject(idOrObject) && !Types.ObjectId.isValid(idOrObject)) {
    objectId = idOrObject["_id"] || idOrObject["id"];
  } else {
    objectId = idOrObject;
  }

  return objectId && Types.ObjectId.isValid(objectId) ? Types.ObjectId(objectId) : Types.ObjectId();
}

function toDotNotation(target, dotNotation = {}, prefix = "") {
  if (typeof target !== "object" && !Array.isArray(target)) {
    return (dotNotation[prefix] = target);
  }

  for (const [key, value] of Object.entries(target)) {
    let appendPrefix = prefix + key;

    if (Array.isArray(value)) {
      value.forEach((v, i) => toDotNotation(v, value, i + ""));
    } else if (typeof value === "object") {
      appendPrefix += ".";
      toDotNotation(value, dotNotation, appendPrefix);

      continue;
    }

    dotNotation[appendPrefix] = target[key];
  }

  return dotNotation;
}

function queryToProjection(fields, includeFields = true) {
  const projectionMark = includeFields ? 1 : 0;

  if (fields && Array.isArray(fields)) {
    return fields.reduce((acc, field) => {
      const fieldName = field.substring(1);

      if (field.startsWith("-")) {
        acc[fieldName] = 0;
      } else if (field.startsWith("+")) {
        acc[fieldName] = 1;
      } else {
        acc[field] = projectionMark;
      }

      return acc;
    }, {});
  } else if (fields && typeof fields === "object") {
    return fields;
  } else if (fields && typeof fields === "string") {
    return {
      [fields]: projectionMark,
    };
  }

  return {};
}

function toJSONModelTransformer(skipKeys = [], mappingFns = []) {
  const defaultKeysToSkip = ["__v", "createdAt", "updatedAt"];

  mappingFns = Array.isArray(mappingFns) ? mappingFns : [mappingFns];

  return {
    transform: function (_doc, retDoc) {
      (skipKeys.length ? skipKeys : defaultKeysToSkip).forEach((key) => delete retDoc[key]);

      mappingFns.forEach((fn) => fn(retDoc));

      return retDoc;
    },
  };
}

function createLookupStage(lookupOptions) {
  const defaultOptions = {
    foreignField: "_id",
    unwindField: true,
  };

  const {
    from: model,
    localField,
    foreignField,
    as: asKey,
    unwindField,
  } = Object.assign(defaultOptions, lookupOptions || {});

  const newFieldName = asKey || localField;

  let lookupStage = {
    $lookup: {
      from: model,
      localField,
      foreignField,
      as: newFieldName,
    },
  };

  if (unwindField) {
    return [
      lookupStage,
      {
        $unwind: {
          path: `$${newFieldName}`,
          preserveNullAndEmptyArrays: true,
        },
      },
    ];
  } else {
    return [lookupStage];
  }
}

module.exports = {
  getCollectionName,
  toObjectId,
  toDotNotation,
  queryToProjection,
  toJSONModelTransformer,
  createLookupStage,
};
