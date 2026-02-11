const SubscriptionsService = require("../services/subscriptionsService");
const handleError = require("../helpers/errorHandler");
const { getSubdomain } = require("../helpers/buildUrl");

module.exports = {
    async email(req, res) {
        try {
            const subdomain = getSubdomain(req);
            if (!subdomain) {
                 return res.status(400).json({ error: "Subdomain not found" });
            }

            await SubscriptionsService.createEmailSubscription(req.body, subdomain);

            return res.status(201).json({
                status: "success",
                message: "Email subscribed successfully"
            });
        } catch (error) {
            return handleError(res, error);
        }
    },

    
    async push(req, res) { 
          try {
            const subdomain = getSubdomain(req);
        
            if (!subdomain) {
                 return res.status(400).json({ error: "Subdomain not found" });
            }

            await SubscriptionsService.createPushSubscription(req.body, subdomain);

            return res.status(201).json({
                status: "success",
                message: "Push subscription saved successfully"
            });
        } catch (error) {
            return handleError(res, error);
        }
    },

    async tasks(req, res) { 
        try {
            const iconFile = req.files?.icon?.[0];
            const imageFile = req.files?.image?.[0];
            
            await SubscriptionsService.createPushTask(req.body, { icon: iconFile, image: imageFile });

            return res.status(201).json({
                status: "success",
                message: "Push task created successfully"
            });
        } catch (error) {
            return handleError(res, error);
        }
    },

    async getTasks(req, res) {
        try {
            const userId = req.user.userId;

            let { page = 1, limit = 10 } = req.query;
     
            page = Number(page);
            limit = Number(limit);

            if (Number.isNaN(page) || page < 1) {
                return res.status(400).json({ message: 'Invalid page' });
            }
      
            if (Number.isNaN(limit) || limit < 1 || limit > 100) {
                return res.status(400).json({ message: 'Invalid limit' });
            }
      
            const result = await SubscriptionsService.getUserTasks({
                userId,
                page,
                limit,
            });

            return res.json(result);
        } catch (error) {
             return handleError(res, error);
     }
  }
};