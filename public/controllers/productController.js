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
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const Counter_1 = __importDefault(require("../models/Counter"));
const validateProduct_1 = require("../utils/validateProduct");
const mongoose_1 = __importDefault(require("mongoose"));
// #####################  GET UNIQUE CUSTOM ID FOR FILTERING METHODS (OPTIONAL) ########################
const getNextCustomId = (entity) => __awaiter(void 0, void 0, void 0, function* () {
    const counter = yield Counter_1.default.findOneAndUpdate({ entity }, { $inc: { lastId: 1 } }, { new: true, upsert: true });
    return counter.lastId;
});
// #####################  CREATE PRODUCTS CONTROLLER ########################
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price, category, tags, variants, inventory } = req.body;
        const productData = { name, description, price, category, tags, variants, inventory };
        const validation = (0, validateProduct_1.validateProduct)(productData);
        if (!validation.success) {
            return res.status(400).json({ success: false, error: validation.error });
        }
        const product_id = yield getNextCustomId('product');
        const product = new Product_1.default(Object.assign(Object.assign({}, productData), { product_id: product_id }));
        yield product.save();
        res.status(201).json({
            success: true,
            message: 'Product created successfully!',
            data: product,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to create product' });
    }
});
exports.createProduct = createProduct;
// #####################  GET ALL PROPDUCTS CONTROLLER ########################
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const searchTerm = ((_a = req.query.searchTerm) === null || _a === void 0 ? void 0 : _a.toString().trim()) || '';
    console.log("searchTerm", searchTerm);
    try {
        let products;
        if (searchTerm) {
            products = yield Product_1.default.find({ name: { $regex: searchTerm, $options: 'i' } });
        }
        else {
            products = yield Product_1.default.find();
        }
        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: searchTerm ? `Products not found` : 'Products not found',
            });
        }
        res.status(200).json({
            success: true,
            message: searchTerm ? `Products matching search term '${searchTerm}' fetched successfully!` : 'Products fetched successfully!',
            data: products,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Products not found' });
    }
});
exports.getAllProducts = getAllProducts;
// #####################  GET PRODUCT BY ID CONTROLLER ########################
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const product = mongoose_1.default.Types.ObjectId.isValid(productId)
            ? yield Product_1.default.findById(productId)
            : yield Product_1.default.findOne({ product_id: Number(productId) });
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Product fetched successfully!',
            data: product,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Product not found' });
    }
});
exports.getProductById = getProductById;
// #####################  UPDATE PRODUCT CONTROLLER ########################
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price, category, tags, variants, inventory } = req.body;
        const productData = { name, description, price, category, tags, variants, inventory };
        // Validate product data
        const validation = (0, validateProduct_1.validateProductPartial)(req.body);
        if (!validation.success) {
            return res.status(400).json({ success: false, error: validation.error });
        }
        const query = mongoose_1.default.Types.ObjectId.isValid(req.params.productId)
            ? { _id: req.params.productId }
            : { product_id: Number(req.params.productId) };
        const product = yield Product_1.default.findOneAndUpdate(query, productData, { new: true });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Product updated successfully!',
            data: product,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to update product' });
    }
});
exports.updateProduct = updateProduct;
// #####################  DELETE PRODUCT CONTROLLER ########################
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = mongoose_1.default.Types.ObjectId.isValid(req.params.productId)
            ? { _id: req.params.productId }
            : { product_id: Number(req.params.productId) };
        const product = yield Product_1.default.findOneAndDelete(query);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully!',
            data: null,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to delete product' });
    }
});
exports.deleteProduct = deleteProduct;
