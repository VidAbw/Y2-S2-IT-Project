const express = require("express");
const router = express.Router();
const orderRoutes = require("./modules/order/route.js");
const userRoutes = require("./modules/user/route.js");
const foodItemRoutes = require("./modules/foot.item/route.js");
const reservationRoutes = require("./modules/reservation/route.js");

router.use("/order", orderRoutes);
router.use("/food-item", foodItemRoutes);
router.use("/users", userRoutes);
router.use("/reservations", reservationRoutes); 

module.exports = router;
 