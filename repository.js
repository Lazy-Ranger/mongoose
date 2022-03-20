const { Paginable } = require("./pagination/paginable-collection");
const { handleMongooseValidationError } = require("./utils");

class BaseRepository extends Paginable {
  constructor(model) {
    super(model);
  }

  async insert(data) {
    try {
      const createdRecord = new this.model(data);
      return await createdRecord.save();
    } catch (err) {
      handleMongooseValidationError(err);
      console.log(`[Repository]: Cannot create ${this.collectionName} error`, err);
    }
  }

  async updateOne(srchQuery, updateQuery, options = {}) {
    try {
      return await this.model.findOneAndUpdate(srchQuery, updateQuery, options).exec();
    } catch (err) {
      handleMongooseValidationError(err);
      console.log(`[Repository]: Cannot update ${this.collectionName} error`, err);
    }
  }

  async updateMany(srchQuery, updateQuery, options = {}) {
    try {
      return await this.model.updateMany(srchQuery, updateQuery, options).exec();
    } catch (err) {
      handleMongooseValidationError(err);
      console.log(`[Repository]: Cannot update ${this.collectionName}s error`, err);
    }
  }

  async findOne(srchQuery = {}, projection = {}) {
    try {
      return await this.model.findOne(srchQuery).select(projection).exec();
    } catch (err) {
      handleMongooseValidationError(err);
      console.log(`[Repository]: Cannot find ${this.collectionName} error`, err);
    }
  }

  async findMany(srchQuery = {}, projection = {}) {
    try {
      return await this.model.find(srchQuery).select(projection).exec();
    } catch (err) {
      handleMongooseValidationError(err);
      console.log(`[Repository]: Cannot find ${this.collectionName} error`, err);
    }
  }

  async removeOne(srchQuery = {}) {
    try {
      return await this.model.findOneAndDelete(srchQuery).exec();
    } catch (err) {
      handleMongooseValidationError(err);
      console.log(`[Repository]: Cannot remove ${this.collectionName} error`, err);
    }
  }

  async removeMany(srchQuery = {}) {
    try {
      return await this.model.deleteMany(srchQuery).exec();
    } catch (err) {
      handleMongooseValidationError(err);
      console.log(`[Repository]: Cannot remove(s) ${this.collectionName} error`, err);
    }
  }

  async count(srchQuery = {}) {
    try {
      return await this.model.countDocuments(srchQuery);
    } catch (err) {
      handleMongooseValidationError(err);
      console.log(`[Repository]: Cannot count ${this.collectionName} error`, err);
    }
  }
}

module.exports = {
  BaseRepository,
};
