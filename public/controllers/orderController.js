"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrders = exports.createOrder = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const validateOrder_1 = require("../utils/validateOrder");
// #####################  CREATE ORDER CONTROLLER ########################
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderData = (0, validateOrder_1.validateCreateOrder)(req.body);
        const { email, productId, price, quantity } = orderData;
        const product = yield Product_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }
        if (product.inventory.quantity < quantity) {
            return res.status(400).json({ success: false, error: 'Insufficient quantity available in inventory' });
        }
        const newQuantity = product.inventory.quantity - quantity;
        const newInStock = newQuantity > 0;
        yield Product_1.default.findByIdAndUpdate(productId, {
            'inventory.quantity': newQuantity,
            'inventory.inStock': newInStock,
        });
        const order = new Order_1.default({
            email,
            productId,
            price,
            quantity,
        });
        yield order.save();
        res.status(201).json({
            success: true,
            message: 'Order created successfully!',
            data: order,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to create order' });
    }
});
exports.createOrder = createOrder;
// #####################  GET ORDER CONTROLLER ########################
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.query.email;
    if (email && !(0, validateOrder_1.isValidEmail)(email)) {
        return res.status(400).json({ success: false, error: 'Invalid email format' });
    }
    try {
        let orders;
        if (email) {
            orders = yield Order_1.default.find({ email });
            if (orders.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: `No orders found for user email '${email}'`,
                });
            }
            res.status(200).json({
                success: true,
                message: `Orders fetched successfully for user email '${email}'!`,
                data: orders,
            });
        }
        else {
            orders = yield Order_1.default.find();
            if (orders.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No orders found',
                });
            }
            res.status(200).json({
                success: true,
                message: 'Orders fetched successfully!',
                data: orders,
            });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch orders' });
    }
});
exports.getAllOrders = getAllOrders;
