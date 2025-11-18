const db = require("../db/models");

module.exports = {
  async createPrelanding(data) {
    const { templateName, subdomain, templateData } = data;

    if (!templateName || typeof templateName !== "string") {
      throw { type: "validation", message: "templateName is required and must be a string" };
    }

    if (!subdomain || typeof subdomain !== "string") {
      throw { type: "validation", message: "subdomain is required and must be a string" };
    }

    if (!templateData || typeof templateData !== "object") {
      throw { type: "validation", message: "templateData must be a JSON object" };
    }

    const exists = await db.Prelanding.findOne({ where: { subdomain } });

    if (exists) {
      throw { type: "conflict", message: "Subdomain already exists" };
    }

    const item = await db.Prelanding.create({
      templateName,
      subdomain,
      templateData,
      status: "pending"
    });

    return item;
  },
  async getPrelandingBySubdomain(subdomain) {
   return await db.Prelanding.findOne({
     where: { subdomain }
   });
  }  
};
