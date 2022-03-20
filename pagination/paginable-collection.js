const { Page } = require("./page");
const { PaginationOptions } = require("./pagination-options");
const { handleMongooseValidationError, getCollectionName } = require("../utils");
const { PageQueryChainableOperations } = require("./page-query-chainable-operations");

class Paginable {
  constructor(model) {
    this.model = model;
    this.collectionName = getCollectionName(this.model);
  }

  static getPaginationOptions(paginationOptions) {
    let { limit = 10, page = 1, sortBy = "_id", orderBy = -1 } = paginationOptions || {};

    try {
      limit = +limit;
      page = +page;
    } catch (err) {
      limit = 10;
      page = 1;
    }

    if (limit < 1) {
      limit = 10;
    }

    if (page < 1) {
      page = 1;
    }

    const skip = page === 1 ? 0 : limit * (page - 1);

    return {
      limit,
      page,
      sortBy,
      orderBy,
      skip,
    };
  }

  static async createPaginationResult(model, data, paginationOptions) {
    const { page, limit } = paginationOptions || {};

    const recordsSize = await model.countDocuments().exec();

    return new Page(page, limit, data, recordsSize);
  }

  async getPage(
    modelQueryOptions,
    paginationOptions = PaginationOptions.defaultOptions(),
    chainableOperations = PageQueryChainableOperations.defaultChain()
  ) {
    // set pagination limit and page
    const { limit, page, sortBy, orderBy, skip } =
      Paginable.getPaginationOptions(paginationOptions);

    chainableOperations = new PageQueryChainableOperations(chainableOperations);

    // set pagination sort and order
    const sortAndOrderQuery = {
      [sortBy]: orderBy,
    };

    const { searchQuery = {}, projection = {}, populate = [] } = modelQueryOptions || {};

    const chainableOperationsDataMap = {
      populate,
      sort: sortAndOrderQuery,
      skip,
      limit,
      lean: {},
      select: projection,
    };

    try {
      let queryPlan = this.model.find(searchQuery);

      // prepare the chain to be called on query (sort, limit, populate ...)
      Object.entries(chainableOperations).forEach((operation) => {
        const [operationName, isInChain] = operation;

        if (!isInChain) {
          return;
        }

        const data = chainableOperationsDataMap[operationName];
        queryPlan = queryPlan[operationName](data);
      });

      // execute the query plan
      const data = await queryPlan.exec();

      return await Paginable.createPaginationResult(this.model, data, { limit, page });
    } catch (err) {
      console.log(`[Pagination]: Cannot find ${this.collectionName} list error`, err);
      handleMongooseValidationError(err);
    }
  }
}

module.exports = {
  Paginable,
};
