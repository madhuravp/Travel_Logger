import React from "react";
import { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";

import LogEntryForm from "./LogEntryForm";

import LogDeleteForm from "./LogDeleteForm";

require("dotenv").config();

// MapUI Component to display various locations created for each trip on the map.
const Map = ({ entry, getEntries }) => {
  {
    const [logEntries1, setLogEntries1] = useState({});
    const [showPopup, setShowPopup] = useState({});
    const [addEntryLocation, setAddEntryLocation] = useState(null);
    const [deleteButton, setDeleteButton] = useState(0);
    const [showDeleteButton, setShowDeleteButton] = useState({});

    let lat = 40.7128;
    let long = -74.006;

    const handleDelete = (e) => {
      setDeleteButton(e.nativeEvent.button);
    };

    /*
      Destructure the data obtained from "trips" component.
      Obtain the "entryInfo" array holding all the objects representing "trip location points". 
    */
    const { entryInfo } = entry;
    const { googleId } = entry;

    if (entryInfo.length > 0) {
      lat = entryInfo[0].latitude;
      long = entryInfo[0].longitude;
    }

    const [viewport, setViewport] = useState({
      width: "100%",
      height: 600,
      latitude: lat,
      longitude: long,
      zoom: 4,
    });

    const showAddMarkerPopup = (event) => {
      const [longitude, latitude] = event.lngLat;
      setAddEntryLocation({
        latitude,
        longitude,
      });
      setShowPopup({});
    };

    return (
      <div>
        <h2>{entry.title} Trip</h2>
        <ReactMapGL
          {...viewport}
          mapStyle="mapbox://styles/madhuravp/ckeu9enyn9scg19k2r8v5m985"
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          onViewportChange={setViewport}
          onDblClick={showAddMarkerPopup}
        >
          {/* Map through the entryInfo array to show all the points. */}
          {entryInfo.map((singleEntry) => (
            <React.Fragment key={singleEntry._id}>
              <Marker
                latitude={singleEntry.latitude}
                longitude={singleEntry.longitude}
              >
                {/* Detect a right click for deleting a point. LogDeleteForm component shows up on right clicking. */}
                <div
                  onMouseDown={(e) => {
                    if (e.nativeEvent.button === 2) {
                      setShowDeleteButton({
                        [singleEntry._id]: true,
                      });
                    }
                  }}
                >
                  {showDeleteButton[singleEntry._id] ? (
                    <LogDeleteForm
                      onClose={() => {
                        setShowDeleteButton({
                          [singleEntry._id]: false,
                        });
                        getEntries();
                      }}
                      // Cancel delete function called from LogDeleteForm.
                      cancelDelete={() => {
                        setShowDeleteButton({
                          [singleEntry._id]: false,
                        });
                      }}
                      singleEntry={singleEntry}
                      link={entry.link}
                      googleId={googleId}
                    />
                  ) : null}
                  {/* Show the popup with the user entered information on a single click  */}
                  <div
                    onClick={(ev) => {
                      setShowPopup({
                        [singleEntry._id]: true,
                      });
                      setShowDeleteButton({
                        [singleEntry._id]: false,
                      });
                    }}
                    onDoubleClick={() => {
                      console.log("doubleClick");
                      setShowPopup({
                        [singleEntry._id]: false,
                      });
                      let latitude = singleEntry.latitude;
                      let longitude = singleEntry.longitude;
                      setAddEntryLocation({
                        latitude,
                        longitude,
                      });
                    }}
                  >
                    <svg
                      className="marker"
                      style={{
                        width: `${6 * viewport.zoom}px`,
                        height: `${6 * viewport.zoom}px`,
                      }}
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                </div>
              </Marker>

              {showPopup[singleEntry._id] ? (
                <Popup
                  latitude={singleEntry.latitude}
                  longitude={singleEntry.longitude}
                  closeButton={true}
                  closeOnClick={false}
                  dynamicPosition={true}
                  onClose={() => setShowPopup({})}
                  anchor="top"
                >
                  <div className="popup">
                    <h3>{singleEntry.title}</h3>
                    <p>
                      <b>{singleEntry.comments}</b>
                    </p>
                    <p>{singleEntry.description}</p>
                    {singleEntry.image ? (
                      <a className="link" href={singleEntry.image}>
                        Pics
                      </a>
                    ) : null}
                    {singleEntry.visitDate ? (
                      <small>
                        Visited On:{" "}
                        {new Date(singleEntry.visitDate).toLocaleDateString()}
                      </small>
                    ) : null}
                  </div>
                </Popup>
              ) : null}
            </React.Fragment>
          ))}
          {addEntryLocation ? (
            <>
              <Marker
                latitude={addEntryLocation.latitude}
                longitude={addEntryLocation.longitude}
              >
                <div>
                  <svg
                    className="createMarker"
                    style={{
                      width: `${6 * viewport.zoom}px`,
                      height: `${6 * viewport.zoom}px`,
                    }}
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
              </Marker>
              <Popup
                latitude={addEntryLocation.latitude}
                longitude={addEntryLocation.longitude}
                closeButton={true}
                closeOnClick={false}
                dynamicPosition={true}
                onClose={() => setAddEntryLocation(null)}
                anchor="top"
              >
                <div className="popup">
                  <LogEntryForm
                    onClose={() => {
                      setAddEntryLocation(null);
                      getEntries();
                    }}
                    location={addEntryLocation}
                    link={entry.link}
                    entryInfo={entryInfo}
                    googleId={googleId}
                  />
                </div>
              </Popup>
            </>
          ) : null}
        </ReactMapGL>
      </div>
    );
  }
};

export default Map;
