"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidEmail = exports.validateCreateOrder = void 0;
const zod_1 = require("zod");
const CreateOrderSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    productId: zod_1.z.string(),
    price: zod_1.z.number().positive(),
    quantity: zod_1.z.number().min(1),
});
// ############ ORDER VALIDATOR ###############
const validateCreateOrder = (data) => {
    try {
        const validatedData = CreateOrderSchema.parse(data);
        return validatedData;
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            throw new Error(error.errors.map(err => err.message).join(', '));
        }
        else {
            throw error;
        }
    }
};
exports.validateCreateOrder = validateCreateOrder;
// ############ EMAIL VALIDATOR FOR SEARCH PARAMS ###############
const emailSchema = zod_1.z.string().email();
const isValidEmail = (email) => {
    try {
        emailSchema.parse(email);
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.isValidEmail = isValidEmail;
