
import connectDB from '../../DB/connection.js';
import { globalErrorHandel } from '../Services/errorHandling.js';
import AuthRouter from './Auth/Auth.router.js';
import UserRouter from './User/User.router.js';
import CategoryRouter from "./Category/Category.router.js";
import ProductRouter from './product/product.router.js';
import CartRouter from './cart/cart.router.js';
import OrderRouter from './order/order.router.js';
import feedBackRouter from './feedBack/feedBack.router.js';
import blockRouter from './block/block.router.js';
import reportRouter from './report/report.router.js';
import path from 'path';
import cors from 'cors';

import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fullPath = path.join(__dirname, '../upload');
const initApp = (app, express) => {
    app.use(cors());
    connectDB();
    app.use(express.json());
    app.use('/upload', express.static(fullPath));
    app.use("/auth", AuthRouter);
    app.use('/user', UserRouter);
    app.use('/category', CategoryRouter);
    app.use('/product', ProductRouter);
    app.use('/cart', CartRouter);
    app.use('/order', OrderRouter);
    app.use('/feedBack', feedBackRouter);
    app.use('/block', blockRouter);
    app.use('/report', reportRouter);
    app.use('/*', (req, res) => {
        return res.json({ messaga: "page not found" });
    })
    //global error handler
    app.use(globalErrorHandel);
}
export default initApp;