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

      if (error.message === "Prelanding limit reached") {

        return res.status(403).json({
          error: "limit_reached",
          message: "You have reached your plan limit.",
          currentCount: error.extra.currentCount,
          planLimit: error.extra.planLimit
        });
      }

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
  },

  async update(req, res) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;

      if (!id || !userId) {
        return res.status(400).json({ error: "Invalid request data" });
      }

      const result = await PrelandingService.updatePrelanding(id, req.body, userId);

      return res.status(201).json({
        status: "success",
        data: result
      });
    } catch (error) {
      return handleError(res, error);
    }
  },
};
