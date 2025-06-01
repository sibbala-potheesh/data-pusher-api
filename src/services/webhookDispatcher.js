const axios = require("axios");

exports.dispatchToDestinations = async (destinations, payload) => {
  const results = [];

  for (const dest of destinations) {
    const method = (dest.httpMethod || "POST").toLowerCase();
    let headers = {};

    try {
      headers = JSON.parse(dest.headers || "{}");
    } catch (e) {
      results.push({
        url: dest.url,
        status: "failed",
        error: "Invalid headers JSON",
      });
      continue;
    }

    try {
      if (method === "get") {
        await axios.get(dest.url, { headers, params: payload });
      } else {
        await axios[method](dest.url, payload, { headers });
      }

      results.push({
        url: dest.url,
        status: "success",
      });
    } catch (err) {
      results.push({
        url: dest.url,
        status: "failed",
        error: err.message,
      });
    }
  }

  const hasFailures = results.some((r) => r.status === "failed");

  return {
    success: !hasFailures,
    results,
  };
};
