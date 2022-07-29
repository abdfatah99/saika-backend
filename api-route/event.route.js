import express from "express";
import upload from "../file-config/multer.js";
import Auth from "../auth/auth.js"

import {
    eventController,
    eventSpecificController,
} from "../controller/event.controller.js";

const router = express.Router();

router
    .route("/")
    .get(eventController.getEvent) // read data
    .post(upload.single("eventImage"), Auth, eventController.postEvent); // create an event - post an image, protect

router
    .route("/:eventId")
    .get(eventSpecificController.getSpecificEvent)
    .patch(Auth, eventSpecificController.updateSpecificController) // protect
    .delete(Auth, eventSpecificController.deleteSpecificEvent); // protect

export default router;
