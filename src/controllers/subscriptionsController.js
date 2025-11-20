const SubscriptionsService = require("../services/subscriptionsService");
const handleError = require("../helpers/errorHandler");

module.exports = {
    async email(req, res) {
        try {
            await SubscriptionsService.createEmailSubscription(req.body);

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
            await SubscriptionsService.crearePushSubscription(req.body);

            return res.status(201).json({
                status: "success",
                message: "Push subscription saved successfully"
            });
        } catch (error) {
            return handleError(res, error);
        }
    }
};