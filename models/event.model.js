import mongoose from "mongoose";

const eventSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  eventName: {
    type: String,
    required: true,
  },
  eventImageUrl:{
    type: String,
    required: true
  },
  eventCategory: {
    type: String,
    required: true,
  },
  benefits: String,
  description: String,
  eventDate: Date,
  paymentType: String,
  price: {
    type: String
    // optional
  },
  registrationLink: String,
  occuranceType: String,
  location: String,
  StartTime: String,
  endTime: String,
  instagram: String,
  facebook: String,
  twitter: String

});

export default mongoose.model("Event", eventSchema)