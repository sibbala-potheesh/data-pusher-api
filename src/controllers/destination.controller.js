const service = require("../services/destination.service");

exports.create = (req, res) => {
  service.createDestination(
    req.body.accountId,
    req.body,
    (err, destination) => {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json(destination);
    }
  );
};

exports.listByAccount = (req, res) => {
  service.getDestinationsByAccount(
    req.params.accountId,
    (err, destinations) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json(destinations);
    }
  );
};

exports.update = (req, res) => {
  service.updateDestination(req.params.id, req.body, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "Destination updated" });
  });
};

exports.remove = (req, res) => {
  service.deleteDestination(req.params.id, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "Destination deleted" });
  });
};
