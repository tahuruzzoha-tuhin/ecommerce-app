"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const router = (0, express_1.Router)();
// ############ PRODUCTS ROUTES ###############
router.post('/', productController_1.createProduct);
router.get('/', productController_1.getAllProducts);
router.get('/:productId', productController_1.getProductById);
router.put('/:productId', productController_1.updateProduct);
router.delete('/:productId', productController_1.deleteProduct);
exports.default = router;
