const PrelandingService = require("../services/prelandingService");
const { getSubdomain } = require("../helpers/getSubdomain");
const { buildUrl } = require("../helpers/buildUrl");


module.exports = {
  async create(req, res) {
    try {
      const result = await PrelandingService.createPrelanding(req.body);
        const url = buildUrl(result.subdomain);
      return res.status(201).json({
        url: url,
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
  },
  async data(req, res) {
    try {
      const subdomain = getSubdomain(req);

      if (!subdomain) {
        return res.status(400).json({ error: "Subdomain not found" });
      }

      const item = await PrelandingService.getPrelandingBySubdomain(subdomain);

      if (!item) {
        return res.status(404).json({ error: "Not found" });
      }

      const result = {
        templateName: item.templateName,
        templateData: item.templateData,
        status: item.status
      };

      return res.json({ data: result });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  }
};
