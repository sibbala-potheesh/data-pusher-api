const db = require("../config/db");
const Account = require("../models/account.model");

// CREATE
exports.createAccount = (data, callback) => {
  if (!data.accountName || !data.email) {
    return callback(null, {
      status: 400,
      message: "Validation Error",
      details: "accountName and email are required fields.",
    });
  }

  const account = new Account({
    name: data.accountName,
    email: data.email,
    website: data.website,
  });

  db.run(
    `INSERT INTO accounts (id, name, email, website, secretToken) VALUES (?, ?, ?, ?, ?)`,
    [
      account.id,
      account.name,
      account.email,
      account.website,
      account.secretToken,
    ],
    function (err) {
      if (err) {
        return callback(null, {
          status: 500,
          message: "Database Error",
          details: err.message,
        });
      }

      return callback(null, {
        status: 201,
        message: "Account created successfully",
        account,
      });
    }
  );
};

// READ ALL
exports.getAllAccounts = (callback) => {
  db.all(`SELECT * FROM accounts`, [], (err, rows) => {
    if (err) {
      return callback(null, {
        status: 500,
        message: "Database Error",
        details: err.message,
      });
    }

    return callback(null, {
      status: 200,
      message: "Accounts fetched successfully",
      data: rows,
    });
  });
};

// READ BY ID
exports.getAccountById = (id, callback) => {
  db.get(`SELECT * FROM accounts WHERE id = ?`, [id], (err, row) => {
    if (err) {
      return callback(null, {
        status: 500,
        message: "Database Error",
        details: err.message,
      });
    }

    if (!row) {
      return callback(null, {
        status: 404,
        message: "Account not found",
      });
    }

    return callback(null, {
      status: 200,
      message: "Account fetched successfully",
      data: row,
    });
  });
};

// UPDATE
exports.updateAccount = (id, data, callback) => {
  if (!data.name || !data.email) {
    return callback(null, {
      status: 400,
      message: "Validation Error",
      details: "name and email are required fields for update.",
    });
  }

  db.run(
    `UPDATE accounts SET name = ?, email = ?, website = ? WHERE id = ?`,
    [data.name, data.email, data.website, id],
    function (err) {
      if (err) {
        return callback(null, {
          status: 500,
          message: "Database Error",
          details: err.message,
        });
      }

      if (this.changes === 0) {
        return callback(null, {
          status: 404,
          message: "Account not found",
        });
      }

      return callback(null, {
        status: 200,
        message: "Account updated successfully",
      });
    }
  );
};

exports.deleteAccount = (id, callback) => {
  db.run(`DELETE FROM destinations WHERE accountId = ?`, [id], function (err) {
    if (err) {
      return callback(null, {
        status: 500,
        message: "Failed to delete destinations",
        details: err.message,
      });
    }

    db.run(`DELETE FROM accounts WHERE id = ?`, [id], function (err) {
      if (err) {
        return callback(null, {
          status: 500,
          message: "Failed to delete account",
          details: err.message,
        });
      }

      if (this.changes === 0) {
        return callback(null, {
          status: 404,
          message: "Account not found",
        });
      }

      return callback(null, {
        status: 200,
        message: "Account and associated destinations deleted successfully",
      });
    });
  });
};
