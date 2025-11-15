const PrelandingService = require("../services/prelandingService");

module.exports = {
  async create(req, res) {
    try {
      const result = await PrelandingService.createPrelanding(req.body);
      return res.status(201).json({
        url: `http://${result.subdomain}.${process.env.BASE_DOMAIN}`,
      });
    } catch (error) {
      if (error.type === "validation") {
        return res.status(400).json({ error: error.message });
      }
      if (error.type === "conflict") {
        return res.status(409).json({ error: error.message });
      }
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};
