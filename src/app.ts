import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import type { Application } from 'express';

import userRouter from "./module/user/route.js"
import { requireAuth } from "./common/middleware/auth.middleware.js";
import { loadCurrentUser } from "./common/middleware/current-user.middleware.js";
import accountRouter from "./module/account/route.js";
import recordRouter from "./module/record/route.js";

const BASE_PATH = "/api/v1";


const createApplicationServer = (): Application => {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors({
        origin: process.env.CORS,
        credentials: true,
    }))
    app.use(cookieParser());
    app.use(`${BASE_PATH}/users`,requireAuth,userRouter);
    app.use(`${BASE_PATH}/accounts`,requireAuth,loadCurrentUser,accountRouter);
    app.use(`${BASE_PATH}/records`,requireAuth,loadCurrentUser,recordRouter);


    return app;
}

export default createApplicationServer;
