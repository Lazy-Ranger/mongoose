class Page {
  constructor(page = 1, limit = 10, data = [], recordSize = 0) {
    this.page = page;
    this.size = data.length;
    this.totalPages = Math.ceil(recordSize / limit);
    this.data = data;
    this.totalRecords = recordSize;
  }
}

module.exports = {
  Page,
};
