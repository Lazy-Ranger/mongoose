class PageQueryChainableOperations {
  constructor(props) {
    props = Object.assign(PageQueryChainableOperations.defaultChain(), props || {});

    this.populate = props?.populate;
    this.sort = props?.sort;
    this.skip = props?.skip;
    this.limit = props?.limit;
    this.lean = props?.lean;
    this.select = props?.select;
  }

  static defaultChain() {
    return {
      populate: true,
      sort: true,
      skip: true,
      limit: true,
      lean: true,
      select: true,
    };
  }
}

module.exports = {
  PageQueryChainableOperations,
};
