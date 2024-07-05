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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.MONGO_URI;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(DB_URI);
            app.listen(PORT, () => {
                console.log(`Server is running on http://localhost:${PORT} with MongoDB`);
            });
            app.use(express_1.default.json());
            // ############ BOOTSTRAP ROUTE ###############
            app.get('/', (req, res) => {
                res.send({ "message": "Server running with mongodb atlas" });
            });
            // ############ APLICATION ROUTES ###############
            app.use('/api/products', productRoutes_1.default);
            app.use('/api/orders', orderRoutes_1.default);
            // Not Found Route Middleware
            app.use((req, res) => {
                res.status(404).json({
                    success: false,
                    message: 'Route not found'
                });
            });
            // Error Handling Middleware
            app.use((err, req, res, next) => {
                console.error(err.stack);
                res.status(500).json({
                    success: false,
                    error: 'Internal Server Error'
                });
            });
        }
        catch (err) {
            console.error('Failed to connect to MongoDB:', err);
        }
    });
}
main();
