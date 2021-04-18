const mongoose = require("mongoose");
const supergoose = require("supergoose");

// Mongoose Schema for storing the entries
const Schema = mongoose.Schema;

// Schema for a single point on the trip
const logSingleTripSchema = new Schema(
  {
    expenses: Number,
    description: String,
    hotel: String,
    body: String,
    comments: String,
    image: String,
    rating: { type: Number, min: 0, max: 10, default: 0 },
    latitude: {
      type: Number,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180,
    },
    visitDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

logSingleTripSchema.plugin(supergoose);

const LogSingleTrip = mongoose.model("LogSingleTrip", logSingleTripSchema);

// Schema for the entire trip .
const logEntrySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  googleId: String,
  link: String,
  totalExpenses: Number,
  entryInfo: [logSingleTripSchema],
});

const LogEntry = mongoose.model("LogEntry", logEntrySchema);

module.exports = { LogEntry, LogSingleTrip };
