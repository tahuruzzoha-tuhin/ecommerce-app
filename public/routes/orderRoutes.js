"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const router = (0, express_1.Router)();
// ############ ORDERS ROUTES ###############
router.post('/', orderController_1.createOrder);
router.get('/', orderController_1.getAllOrders);
exports.default = router;
