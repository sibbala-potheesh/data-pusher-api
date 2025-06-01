// src/server.js
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

require("./setup");

app.use(bodyParser.json());

app.use("/accounts", require("./routes/account.routes"));
app.use("/destinations", require("./routes/destination.routes"));
app.use("/server", require("./routes/dataHandler.routes"));

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
