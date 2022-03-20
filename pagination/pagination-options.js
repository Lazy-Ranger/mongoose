const { EnumType } = require("../../../utils");

const PaginationOrderBy = new EnumType({
  ASCE: 1,
  DESC: -1,
});

class PaginationOptions {
  constructor(props) {
    props = props || {};

    this.limit = props?.limit || 10;
    this.page = props?.page || 1;
    this.sortBy = props?.sortBy || "_id";
    this.orderBy = props?.orderBy || -1;
  }

  static defaultOptions() {
    return {
      limit: 10,
      page: 1,
      sortBy: "_id",
      orderBy: PaginationOrderBy.DESC,
    };
  }
}

class ProjectionQuery {
  constructor(fields) {
    this.fields = fields || [];
  }

  get fieldsList() {
    if (Array.isArray(this.fields) && this.fields.length) {
      return this.fields;
    }
  }
}

class PaginationQuery extends PaginationOptions {
  constructor(props) {
    super(props);

    props = props || {};

    this.text = props?.search || props?.text || "";
    this.filters = props?.filters || {};
    this.fields = props?.fields || [];
  }

  get pageOptions() {
    return PaginationQuery.options(this);
  }

  static options(selfRef) {
    let { limit = 10, page = 1, sortBy = "_id", orderBy = -1 } = selfRef;

    // set pagination limit and page
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

    return {
      limit,
      page,
      sortBy,
      orderBy,
    };
  }
}

module.exports = {
  PaginationQuery,
  PaginationOptions,
  ProjectionQuery,
  PaginationOrderBy,
};
