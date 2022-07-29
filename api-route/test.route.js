import express from "express";
import testController from "../controller/test.controller.js"

const router = express.Router();

router
    .route('/')
    .get(testController.apiTestData)

export default router;
