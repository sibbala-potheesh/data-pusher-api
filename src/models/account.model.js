const { v4: uuidv4 } = require("uuid");
const generateToken = require("../utils/generateToken");

class Account {
  constructor({ name, email, website }) {
    this.id = uuidv4();
    this.name = name; // matches DB `name` column
    this.email = email;
    this.website = website;
    this.secretToken = generateToken(); // generate token on creation
  }
}

module.exports = Account;
