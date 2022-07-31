import mongoose from "mongoose";
import Event from "../models/event.model.js";

export default class eventDAO {
    static async getEvent(hostname) {
        const databaseResult = await Event.find()
            .exec()
            .then((docs) => {
                // console.log(`access database result: ${data}`)
                // return data
                const response = {
                    event: docs.map((doc) => {
                        return {
                            eventName: doc.eventName,
                            eventCategory: doc.eventCategory,
                            //platform
                            tanggal: doc.eventDate,
                            eventImageUrl: hostname + "/event-image/" + doc.eventImageUrl,
                            eventDetail: {
                                type: "GET",
                                url: "http://localhost:3001/event/" + doc._id,
                            },
                        };
                    }),
                };
                return response.event;
            })
            .catch((error) => {
                console.log(`Event Data Access Object error: ${error}`);
            });
        //console.log(`database result: ${databaseResult}`)
        return databaseResult;
    }

    static async addEvent(data, hostname) {
        try {
            const event = new Event({
                _id: new mongoose.Types.ObjectId(),
                eventName: data.eventName,
                eventImageUrl: data.eventImageUrl,
                eventCategory: data.eventCategory,
                benefits: data.benefits,
                description: data.description,
                eventDate: data.eventDate,
                paymentType: data.paymentType,
                price: data.price,
                registrationLink: data.registrationLink,
                occuranceType: data.occuranceType,
                location: data.location,
                startTime: data.startTime,
                endTime: data.endTime,
                instagram: data.instagram,
                facebook: data.facebook,
                twitter: data.twitter,
            });

            const addEventRestul = event
                .save()
                .then((data) => {
                    console.log(`data added to database: ${data}`);
                    const response = {
                        status: "Data Succesfully added",
                        dataDetail: {
                            type: "GET",
                            //url: "http://localhost:3001/event/" + data._id,
                            url: hostname + "/event/" + data._id
                        },
                    };
                    return response;
                })
                .catch((error) => {
                    const errorStatus = `Error during saving the data: ${error}`;
                    return errorStatus;
                });
            return addEventRestul;
        } catch (error) {
            console.log(`Error during database operation: ${error}`);
        }
    }

    static async getEventDetail(id) {
        const eventDetailResult = await Event.findById(id)
            .exec()
            .then((data) => {
                console.log(`event detail result: ${data}`);
                const response = {
                    eventName: data.eventName,
                    eventImageUrl:
                        "http://localhost:3001/event-image/" +
                        data.eventImageUrl,
                    eventCategory: data.eventCategory,
                    benefits: data.benefits,
                    description: data.description,
                    eventDate: data.eventDate,
                    paymentType: data.paymentType,
                    price: data.price,
                    registrationLink: data.registrationLink,
                    occuranceType: data.occuranceType,
                    location: data.location,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    instagram: data.instagram,
                    facebook: data.facebook,
                    twitter: data.twitter,
                };
                return response;
            });
        return eventDetailResult;
    }

    static async deleteEvent(id) {
        const errorNoData = new Error("There is no data with that specific");
        try {
            const deleteEvent = await Event.deleteOne({ _id: id })
                .exec()
                .then((data) => {
                    // console.log(`Delete Data: ${data.deletedCount}`)
                    return data.deletedCount;
                });
            if (deleteEvent.deletedCount == 0) {
                throw errorNoData;
            }
            // console.log(`Delete Event result: ${deleteEvent.deletedCount}`)
            return deleteEvent;
        } catch (error) {
            console.log(`cannot delete data event: ${error}`);
        }
    }

    static async updateEvent(eventId, updateEventProp) {
        console.log(eventId, updateEventProp);
        const updateResult = await Event.updateOne(
            { _id: eventId },
            { $set: updateEventProp }
        )
            .exec()
            .then((result) => {
                console.log("hasil result update: ");
                console.log(result);
                const response = {
                    acknowledge: result.acknowledged,
                    eventDetail: {
                        type: "GET",
                        url: "http://localhost:3001/event/" + eventId,
                    },
                };
                return response;
            })
            .catch((error) => {
                console.log(`error during saving the update data: ${error}`);
            });
        console.log(`update result: ${updateResult}`);
        return updateResult;
    }
}
