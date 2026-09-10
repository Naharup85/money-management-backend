import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./module/auth/auth.route.js"

const createApplicationServer = () => {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors({
        origin:process.env.CORS,
        credentials:true,
    }))
    app.use(cookieParser());

    app.use("/api/v1/user",userRouter);


    return app;
}

export default createApplicationServer;
