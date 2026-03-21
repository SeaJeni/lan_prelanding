const db = require("../db/models");
const { isValidString, isDuplicate, isValidObject } = require("../helpers/validation");
const { SUBSCRIPTION_PLAN_LIMITS, SUBSCRIPTION_PRICE_MAP } = require('../constants/enums');
const AppError = require("../helpers/appError");

module.exports = {
  async createPrelanding(data, userId) {
    const { templateName, subdomain, templateData, geo, vertical } = data;

    // Check user subscription status
    const user = await db.User.findByPk(userId);

    if (!user || user?.subscriptionStatus !== "active") {
      throw new Error("Active subscription required");
    }

    // Check if user has reached prelanding limit based on their subscription plan
    const prelandingCount = await db.Prelanding.count({
      where: {
        userId,
      }
    });

    const userPlan = Object.entries(SUBSCRIPTION_PRICE_MAP).find(
      ([, priceId]) => priceId === user.subscriptionType
    )?.[0];

    const planLimit = SUBSCRIPTION_PLAN_LIMITS[userPlan];
    
    if (!prelandingCount || !userPlan || !planLimit) {
      throw new Error("Unknown subscription plan");
    }

    if (prelandingCount >= planLimit) {
      throw new AppError("Prelanding limit reached", 400, {
        currentCount: prelandingCount,
        planLimit: planLimit
      });
    }

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
