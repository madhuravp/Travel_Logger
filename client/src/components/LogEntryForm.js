import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import { createLogEntry } from "../API";
import { listLogEntries } from "../API";
import "react-datepicker/dist/react-datepicker.css";

/*
Form to get information about individual points on a particular trip as well as their lattitude and longitude.
*/
const LogEntryForm = ({ location, onClose, link, entryInfo, googleId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, control } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      data.latitude = location.latitude;
      data.longitude = location.longitude;
      data.visitDate = startDate;
      
      // Triggers the function in the API file which creates an entry for a point
      await createLogEntry(data, link, googleId);
      onClose();
    } catch (error) {
      console.log(error);
      setError(error.message);
      setLoading(false);
    }
  };

  // Check if an trip location entry exists to display previously entered information for editing purpose
  let dblClickEntry = entryInfo.find((singleEntry) => {
    return (
      singleEntry.latitude === location.latitude &&
      singleEntry.longitude === location.longitude
    );
  });
  let entryExists = 0;
  if (dblClickEntry === undefined) {
    entryExists = 0;
  } else {
    entryExists = 1;
  }
  const [startDate, setStartDate] = useState();
  const handleChange = (date) => {
    setStartDate(date);
    console.log(date);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="entry-form">
      {error ? <h3 className="error">{error}</h3> : null}
      <label htmlFor="comments">Comments</label>
      <textarea name="comments" rows={3} ref={register}>
        {entryExists ? dblClickEntry.comments : null}
      </textarea>
      <label htmlFor="description">Description</label>
      <textarea name="description" rows={3} ref={register}>
        {entryExists ? dblClickEntry.description : null}
      </textarea>
      <label htmlFor="image">Image</label>
      <input name="image" ref={register} />
      <label htmlFor="visitDate">Visit Date</label>
      <DatePicker
        id="date"
        name="visitDate"
        defaultValue=""
        selected={startDate}
        onChange={(e) => handleChange(e)}
        placeholderText={
          entryExists && dblClickEntry.visitDate
            ? new Date(dblClickEntry.visitDate).toLocaleDateString()
            : null
        }
      />
      <button disabled={loading}>
        {loading ? "Loading..." : "Create Entry"}
      </button>
    </form>
  );
};

// Find which entry is being edited based on longitude and latitude
function findPointEntry(tripPoints, location) {
  if (!tripPoints) {
    return null;
  }
  const entries = tripPoints.entryInfo;
  if (!entries) {
    return null;
  }
  for (let entry of entries) {
    if (
      location.latitude === entry.latitude &&
      location.longitude === entry.longitude
    ) {
      return entry;
    }
  }
  return null;
}

export default LogEntryForm;
