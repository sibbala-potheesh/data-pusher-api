const service = require("../services/account.service");

exports.create = (req, res) => {
  service.createAccount(req.body, (err, account) => {
    if (err) return res.status(400).json({ error: err.message });
    res.status(201).json(account);
  });
};

exports.list = (req, res) => {
  service.getAllAccounts((err, accounts) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(accounts);
  });
};

exports.get = (req, res) => {
  service.getAccountById(req.params.id, (err, account) => {
    if (err || !account)
      return res.status(404).json({ error: "Account not found" });
    res.json(account);
  });
};

exports.update = (req, res) => {
  service.updateAccount(req.params.id, req.body, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "Account updated" });
  });
};

exports.remove = (req, res) => {
  service.deleteAccount(req.params.id, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "Account deleted" });
  });
};
