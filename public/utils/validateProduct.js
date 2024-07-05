"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProduct = void 0;
const zod_1 = require("zod");
const VariantSchema = zod_1.z.object({
    type: zod_1.z.string(),
    value: zod_1.z.string(),
});
const InventorySchema = zod_1.z.object({
    quantity: zod_1.z.number(),
    inStock: zod_1.z.boolean(),
});
const ProductSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    price: zod_1.z.number(),
    category: zod_1.z.string(),
    tags: zod_1.z.array(zod_1.z.string()),
    variants: zod_1.z.array(VariantSchema),
    inventory: InventorySchema,
});
// ############ PRODUCT VALIDATOR ###############
const validateProduct = (productData) => {
    const validation = ProductSchema.safeParse(productData);
    if (!validation.success) {
        return {
            success: false,
            error: validation.error.errors,
        };
    }
    return { success: true };
};
exports.validateProduct = validateProduct;
