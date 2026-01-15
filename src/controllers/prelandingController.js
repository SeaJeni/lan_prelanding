const PrelandingService = require("../services/prelandingService");
const { buildUrl, getSubdomain } = require("../helpers/buildUrl");
const handleError = require("../helpers/errorHandler");

module.exports = {
  async create(req, res) {
    try {
      const userId = req.user.userId;
      const result = await PrelandingService.createPrelanding(req.body, userId);
      const url = buildUrl(result.subdomain, process.env.URL_PREFIX);

      return res.status(201).json({
        url: url,
      });
    } catch (error) {
      return handleError(res, error);
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
