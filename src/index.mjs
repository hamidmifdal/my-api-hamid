import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import router from './Routes/RouteUser.mjs';
import DB from './utils/dbMongoose.mjs';
import errorHandler from './utils/errorHandler.mjs';
import notFoundHandler from './utils/notFoundHandler.mjs';
import { limiter } from './utils/limiter.mjs';
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT || 3000;
const SECRET_COOKIES = process.env.SECRET_COOKIES

const Middlewares = {
    global: [express.json(), helmet(), cors(), express.urlencoded({ extended: true }), limiter, cookieParser(SECRET_COOKIES)],
    error: [notFoundHandler, errorHandler]
};
const app = express();

// Global Middlewares
Middlewares.global.forEach(mw => app.use(mw));

// API Router
app.use("/api/auth", router);

// Error Middlewares (Placed at the end)
Middlewares.error.forEach(mw => app.use(mw));

// Ensure DB is connected before starting the server
DB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at: http://localhost:${PORT}`);
    });
}).catch(error => {
    console.error("Failed to connect to database:", error);
    process.exit(1);
});
