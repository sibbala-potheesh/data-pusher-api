const db = require("../config/db");
const dispatcher = require("../services/webhookDispatcher");

exports.receive = async (req, res) => {
  const token = req.headers["cl-x-token"];
  const contentType = req.headers["content-type"];
  const method = req.method;
  const data = req.body;

  if (method === "GET") {
    if (!contentType || !contentType.includes("application/json")) {
      return res.status(400).json({ message: "Invalid Data" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Un Authenticate" });
  }

  db.all(`SELECT * FROM destinations`, [], async (err, destinations) => {
    if (err || !destinations || destinations.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No destinations configured" });
    }

    const matchedDestinations = destinations.filter((dest) => {
      try {
        const headers = JSON.parse(dest.headers || "{}");
        return headers.APP_SECRET === token;
      } catch {
        return false;
      }
    });

    if (matchedDestinations.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Unauthenticated: No matching APP_SECRET",
      });
    }

    try {
      const dispatchResult = await dispatcher.dispatchToDestinations(
        matchedDestinations,
        data
      );

      if (dispatchResult.success) {
        return res.json({
          success: true,
          message: "Data pushed successfully",
          results: dispatchResult.results,
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "Some destinations failed",
          results: dispatchResult.results,
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Dispatching error occurred",
        error: error.message || error,
      });
    }
  });
};
