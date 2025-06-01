class Destination {
  constructor(id, accountId, url, method, headers) {
    this.id = id;
    this.accountId = accountId;
    this.url = url;
    this.method = method;
    this.headers = headers;
  }
}

module.exports = Destination;
