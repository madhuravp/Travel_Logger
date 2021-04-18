const _ = require("lodash");
const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:1337"
    : "https://travel-log-api.madhuravp.vercel.app";

/* 
Function to get all the trip entries from the back end for a 
user when he makes a GET request after logging in.
*/
export async function listLogEntries(googleId) {
  const response = await fetch(API_URL + "/api/logs/" + googleId, {
    mode: "cors",
  });
  return response.json();
}

/*
Creates a new entry by doing POST request to the back end for given user ("googleId").
- Creates new "trip" entry 
- Creates an individual "point" (location entry) in a particular trip.
*/
export async function createLogEntry(entry, link, googleId) {
  if (entry.title) {
    const title = _.camelCase(entry.title);
    const response = await fetch(API_URL + "/api/logs/" + title, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(entry),
    });
    return response.json();
  } else {
    const sentEntry = { googleId: googleId, ...entry };
    const response = await fetch(API_URL + "/api/logs/" + link, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(sentEntry),
    });
    return response.json();
  }
}

/* Function to delete entries in one of the two ways below for given user ("googleId") ...
- Delete entire trip
- Delete single location in the trip.
*/
export async function deleteLogEntry(singleEntry, link, googleId) {
  const deleteEntry = { googleId: googleId, ...singleEntry };
  console.log(deleteEntry);
  const response = await fetch(API_URL + "/api/logs/" + link + "/", {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(deleteEntry),
  });
  console.log(response);
  return response.json();
}
