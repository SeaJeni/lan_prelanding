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
    }
};