const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const Destination = require("../models/destination.model");

// CREATE
exports.createDestination = (accountId, data, callback) => {
  if (!accountId || !data.url || !data.httpMethod) {
    return callback(null, {
      status: 400,
      message: "Validation Error",
      details: "accountId, url, and httpMethod are required.",
    });
  }

  const id = uuidv4();
  const headers = JSON.stringify(data.headers || {});
  const method = data.httpMethod;

  const destination = new Destination(id, accountId, data.url, method, headers);

  db.run(
    `INSERT INTO destinations (id, accountId, url, httpMethod, headers) VALUES (?, ?, ?, ?, ?)`,
    [
      destination.id,
      destination.accountId,
      destination.url,
      destination.method,
      destination.headers,
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
        message: "Destination created successfully",
        data: {
          id: destination.id,
          accountId: destination.accountId,
          url: destination.url,
          method: destination.method,
          headers: data.headers || {},
        },
      });
    }
  );
};

// GET ALL by Account
exports.getDestinationsByAccount = (accountId, callback) => {
  db.all(
    `SELECT * FROM destinations WHERE accountId = ?`,
    [accountId],
    (err, rows) => {
      if (err) {
        return callback(null, {
          status: 500,
          message: "Database Error",
          details: err.message,
        });
      }

      return callback(null, {
        status: 200,
        message: "Destinations fetched successfully",
        data: rows,
      });
    }
  );
};

// GET by ID
exports.getDestinationById = (id, callback) => {
  db.get(`SELECT * FROM destinations WHERE id = ?`, [id], (err, row) => {
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
        message: "Destination not found",
      });
    }

    return callback(null, {
      status: 200,
      message: "Destination fetched successfully",
      data: row,
    });
  });
};

// UPDATE
exports.updateDestination = (id, data, callback) => {
  if (!data.url || !data.method) {
    return callback(null, {
      status: 400,
      message: "Validation Error",
      details: "url and method are required for update.",
    });
  }

  const headers = JSON.stringify(data.headers || {});

  db.run(
    `UPDATE destinations SET url = ?, httpMethod = ?, headers = ? WHERE id = ?`,
    [data.url, data.method, headers, id],
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
          message: "Destination not found",
        });
      }

      return callback(null, {
        status: 200,
        message: "Destination updated successfully",
      });
    }
  );
};

// DELETE
exports.deleteDestination = (id, callback) => {
  db.run(`DELETE FROM destinations WHERE id = ?`, [id], function (err) {
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
        message: "Destination not found",
      });
    }

    return callback(null, {
      status: 200,
      message: "Destination deleted successfully",
    });
  });
};
