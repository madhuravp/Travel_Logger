import React from "react";
import { useState, useEffect } from "react";
import { listLogEntries } from "../API";
import LogTitleForm from "./LogTitleForm";
import LogDeleteForm from "./LogDeleteForm";

import Map from "./Map";
import {
  BrowserRouter as Router,
  Link,
  NavLink,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
const _ = require("lodash");

// Component that shows all the trips created by the user (googleId)
const Trips = ({ googleId }) => {
  const [logEntries, setLogEntries] = useState([]);
  const [flag, setFlag] = useState(false);
  const [length, setLength] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState({});
  const [cancelDeleteButton, setCancelDeleteButton] = useState(false);

  // Get an array of objects for all the trips corresponding to given user (googleId)
  const getEntries = async () => {
    const logEntries = await listLogEntries(googleId);
    setLogEntries(logEntries);
  };
  useEffect(() => {
    (async () => {
      getEntries();
    })();
  }, []);

  // Opens up the "LogTitleForm" to create a new trip
  const handleClick = () => {
    setFlag((prevValue) => {
      return !prevValue;
    });
    getEntries();
  };

  const cancelDelete = () => {
    setCancelDeleteButton(true);
    setShowDeleteButton({});
  };

  return (
    <Router>
      <div className="container" onContextMenu={(ev) => ev.preventDefault()}>
        <h1 className="heading"> Welcome! Save your trip memories!</h1>
        <button onClick={handleClick} className="button">
          Enter your trip title
        </button>
        {flag ? (
          <div class="formTitle">
            <LogTitleForm handleClick={handleClick} googleId={googleId} />
          </div>
        ) : null}

        {/* Display all the trips created by user (googleId) */}
        {logEntries !== null &&
        logEntries.length !== 0 &&
        logEntries.length !== undefined
          ? logEntries.map((entry, id) => (
              <div key={id}>
                {/* Detect "right click" action which opens up the LogDeleteForm to delete a trip */}
                <li
                  onMouseDown={(e) => {
                    if (e.nativeEvent.button === 2) {
                      setShowDeleteButton({
                        [entry._id]: true,
                      });

                      setCancelDeleteButton(false);
                      e.preventDefault();
                      return false;
                    }
                  }}
                >
                  {/* React Router component to open every trip in a separate link. */}
                  <NavLink
                    to={"/" + entry.link}
                    exact
                    activeStyle={{ color: "green" }}
                  >
                    {entry.title}{" "}
                  </NavLink>
                  {showDeleteButton[entry._id] && !cancelDeleteButton ? (
                    <LogDeleteForm
                      onClose={() => {
                        setShowDeleteButton({
                          [entry._id]: false,
                        });
                        getEntries();
                      }}
                      singleEntry={entry}
                      link={entry.link}
                      cancelDelete={cancelDelete}
                      googleId={googleId}
                    />
                  ) : null}
                </li>
                <Route
                  exact
                  path={"/" + entry.link}
                  render={(props) => (
                    <div className="map">
                      {/* Redirect to home page if delete button is clicked else show the map component for the trip */}
                      {showDeleteButton[entry._id] ? (
                        <Redirect to="/" />
                      ) : (
                        <Map {...props} entry={entry} getEntries={getEntries} />
                      )}
                    </div>
                  )}
                />
              </div>
            ))
          : null}
      </div>
    </Router>
  );
};

export default Trips;
