const querystring = require('querystring');
const url = require('url');

module.exports = class Pagination {
  constructor(req, response) {
    this.currentUrl = req.originalUrl || req.url;
    this.query = req.query;
    this.page = response.page;
    this.nextPage = response.next_page ? this.page + 1 : null;
    this.prevPage = response.prev_page ? this.page - 1 : null;
  }

  getUrls() {
    const nextPageUrl = this.buildUrl(this.nextPage);
    const prevPageUrl = this.buildUrl(this.prevPage);
    return { nextPageUrl, prevPageUrl };
  }

  buildUrl(page) {
    if (page === null) {
      return null;
    }

    let params = Object.assign({}, this.query);
    params.page = page;

    return url.parse(this.currentUrl).pathname + '?' + querystring.stringify(params);
  }
}