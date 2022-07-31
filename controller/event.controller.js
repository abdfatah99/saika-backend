import eventDAO from "../data-access-object/event.dao.js";
import os from 'os'

class eventController {
    static async getEvent(req, res, next) {
        const hostname = req.headers.host
        try {
            const getEventResult = await eventDAO.getEvent(hostname);
            res.status(200).send(getEventResult)
        } catch (error) {
            res.status(500).json({
                message: error,
            });
        }
    }

    static async postEvent(req, res, next) {
        console.log(req.file.originalname);

        let eventImage = req.file.path;
        const eventImageUrl = eventImage.replaceAll("\\", "/").split("/")[2];
        const hostname = req.headers.host

        console.log(`event image url: ${eventImageUrl}`);

        let eventData = {
            eventName: req.body.eventName,
            eventImageUrl: eventImageUrl,
            eventCategory: req.body.eventCategory,
            benefits: req.body.benefits,
            description: req.body.description,
            eventDate: req.body.eventDate,
            paymentType: req.body.paymentType,
            price: req.body.price,
            registrationLink: req.body.registrationLink,
            occuranceType: req.body.occuranceType,
            location: req.body.location,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            instagram: req.body.instagram,
            facebook: req.body.facebook,
            twitter: req.body.twitter,
        };

        try {
            const addEvent = await eventDAO.addEvent(eventData, hostname);
            console.log(`event controller result: ${addEvent}`);

            res.status(200).send(addEvent);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: error,
            });
        }
    }
}

class eventSpecificController {
    static async getSpecificEvent(req, res, next) {
        const id = req.params.eventId;
        const findResult = await eventDAO.getEventDetail(id);
        if (findResult) {
            res.status(200).send(findResult)
        } else {
            res.status(500).json({
                message: "cannot find the event",
            });
        }
    }

    static async deleteSpecificEvent(req, res, next) {
        const id = req.params.eventId;
        const deleteResult = await eventDAO.deleteEvent(id);
        console.log(deleteResult);
        if (deleteResult) {
            res.status(200).json({
                message: "data berhasil dihapus",
            });
        } else {
            res.status(500).json({
                message: "tidak ada data yang dihapus",
            });
        }
    }

    static async updateSpecificController(req, res, next) {
        const eventId = req.params.eventId;
        const updateEventProp = {};

        for (const ops of req.body) {
            updateEventProp[ops.propName] = ops.value;
        }

        console.log(updateEventProp);

        const updateEventResult = await eventDAO.updateEvent(
            eventId,
            updateEventProp
        );

        if (updateEventResult.acknowledge) {
            res.status(200).json({
                message: "update Event Success",
                eventDetail: updateEventResult.eventDetail,
            });
        } else {
            res.status(200).json({
                message: "data unupdated",
            });
        }
    }
}

export { eventController, eventSpecificController };
