import express from "express";


const createApplicationServer = () => {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    return app;
}

export default createApplicationServer;
