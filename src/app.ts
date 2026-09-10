import express from "express";
import userRouter from "./module/auth/auth.route.js"

const createApplicationServer = () => {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));


    app.use("/api/v1/user",userRouter);


    return app;
}

export default createApplicationServer;
