const { Router } = require("express");
const { LogEntry } = require("../models/LogEntry");
const _ = require("lodash");
const router = Router();

/*
Gets the user ("googleId") from the front end and sends back all the trips corresponding
to that googleId back to the front end
*/
router.get("/:googleId", async (req, res, next) => {
  try {
    LogEntry.find({ googleId: req.params.googleId }, (err, foundEntry) => {
      res.json(foundEntry);
    });
  } catch (error) {
    next(error);
  }
});

/* 
Creates a new trip or an individual point on a trip based on the data sent from
the Front end. If it receives a only a trip title it creates a new trip otherwise 
it creates a point in a trip.
*/
router.post("/:trip", async (req, res, next) => {
  try {
    if (req.body.title) {
      title = _.startCase(req.body.title);
      const logTitleLink = {
        title,
        link: req.params.trip,
        googleId: req.body.googleId,
      };
      const logEntry = new LogEntry(logTitleLink);
      const createdLogEntry = await logEntry.save();
      res.json(createdLogEntry);
    } else {
      LogEntry.findOne(
        { link: req.params.trip, googleId: req.body.googleId },
        (err, foundEntry) => {
          
          /*
           Detects if a new point is being created or an existing point is being edited based on the 
           latitude and longitude received from the front end.
          */
          let index = foundEntry.entryInfo.findIndex(
            (o) =>
              o.latitude === req.body.latitude &&
              o.longitude === req.body.longitude
          );

          if (index === -1) {
            console.log("object not founc");
            foundEntry.entryInfo.push(req.body);
            foundEntry.save();
          } else {
            function clean(obj) {
              for (var propName in obj) {
                if (obj[propName] === null || obj[propName] === "") {
                  delete obj[propName];
                }
              }
              return obj;
            }

            newReq = clean(req.body);
            arr = foundEntry.entryInfo[index];
            const arr1 = Object.assign(arr, newReq);
            foundEntry.entryInfo[index] = arr1;
            foundEntry.save();
          }
          res.json(foundEntry);
        }
      );
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(422);
    }
    next(error);
  }
});

/*
logic to delete an entire trip or an individual point on the trip. If we get only the
title from the front end we delete the entire trip. 
Otherwise delete specific point in a trip based on the given latitude and longitude.  
*/
router.delete("/:trip", async (req, res, next) => {
  try {
    if (req.body.title) {
      LogEntry.findOneAndDelete(
        { link: req.params.trip, googleId: req.body.googleId },
        function (err, docs) {
          if (err) {
            console.log(err);
          } else {
            res.json(docs);
          }
        }
      );
    } else {
      LogEntry.findOne(
        { link: req.params.trip, googleId: req.body.googleId },
        (err, foundEntry) => {
          let index = foundEntry.entryInfo.findIndex(
            (o) =>
              o.latitude === req.body.latitude &&
              o.longitude === req.body.longitude
          );
          if (index > -1) {
            foundEntry.entryInfo.splice(index, 1);
            foundEntry.save();
          }
          res.json(foundEntry);
        }
      );
    }
  } catch (error) {
    console.log(error.name);
    if (error.name === "ValidationError") {
      res.status(422);
    }
    next(error);
  }
});

module.exports = router;
