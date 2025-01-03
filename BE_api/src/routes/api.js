import express from "express";
import screenshotRouter from "./screenshotRouter.js";

const apiRouter = express.Router();

apiRouter.use("/user/screenshot", screenshotRouter);

export default apiRouter;
