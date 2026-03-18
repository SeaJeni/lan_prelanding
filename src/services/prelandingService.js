const db = require("../db/models");
const { isValidString, isDuplicate, isValidObject } = require("../helpers/validation");

module.exports = {
  async createPrelanding(data, userId) {
    const { templateName, subdomain, templateData, geo, vertical } = data;

    isValidString(templateName);
    isValidString(subdomain);
    isValidString(geo);
    isValidString(vertical);
    isValidObject(templateData);
    await isDuplicate("Prelanding", "subdomain", subdomain);

    const item = await db.Prelanding.create({
      templateName,
      subdomain,
      templateData,
      userId: userId,
      status: "pending",
      geo,
      vertical
    });

    return item;
  },

  async getPrelandingBySubdomain(subdomain) {
    return await db.Prelanding.findOne({
      where: { subdomain }
    });
  },

  async updatePrelanding(id, data, userId) {
    try {
      const prelanding = await db.Prelanding.findOne({
        where: { id, userId }
      });

      if (!prelanding) {
        throw new Error("Prelanding not found");
      }

      if (!prelanding.isActive) {
        throw new Error("Prelanding is not active");
      }

      if (data) {
        if (data.templateName) {
          isValidString(data.templateName);
          prelanding.templateName = data.templateName;
        }
        if (data.templateData) {
          isValidObject(data.templateData);
          prelanding.templateData = data.templateData;
        }
        if (data.geo) {
          isValidString(data.geo);
          prelanding.geo = data.geo;
        }
        if (data.vertical) {
          isValidString(data.vertical);
          prelanding.vertical = data.vertical;
        }

        await prelanding.save();
      }

      return prelanding;
    } catch (err) {
      throw err;
    }
  }
};
