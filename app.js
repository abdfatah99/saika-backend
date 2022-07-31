import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv'

import eventAPI from "./api-route/event.route.js";
import userAPI from "./api-route/user.route.js"
//import chatAPI from "./api-route/chat.route.js"
//import testAPI from "./api-route/test.route.js"

const app = express();

const corsOption = {
    origin: "http://localhost:3000",
    creadentials: true,
    optionSuccessStatus: 200
}

app.use(cors(corsOption));
app.use(express.json());
app.use(morgan("dev"));
app.use("/event-image", express.static("./public/event-image"));
dotenv.config();

// connect to database
mongoose.connect("mongodb://db:27017/saikaDatabase");

// initial root for service
//app.use("/test", testAPI)
app.use("/event", eventAPI);
app.use("/user", userAPI);
//app.use("/chat", chatAPI);

//error route handler
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});

export default app;
