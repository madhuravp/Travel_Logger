import React, { useState } from "react";

import { useForm } from "react-hook-form";
import { deleteLogEntry } from "../API";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

// Component which deletes the individual points on the trip as well as an entire trip
const LogDeleteForm = ({
  onClose,
  singleEntry,
  link,
  cancelDelete,
  googleId,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Clicking on the delete button calls the function in the API file to delete the entires from the MongoDb.
      await deleteLogEntry(singleEntry, link, googleId);
      onClose();
    
    } catch (error) {
      console.log(error);
      setError(error.message);
      setLoading(false);
    }
  };

  // Delete form
  return (
    <div className="delete">
      <form onSubmit={handleSubmit(onSubmit)} className="delete-form">
        {error ? <h3 className="error">{error}</h3> : null}
        <button
          className="del-button"
          onClick={() => {
            setOpen(true);
          }}
        >
          Delete{" "}
          <DeleteForeverIcon
            style={{
              display: "inline-block",
              marginBottom: "-4.5px",
              marginLeft: "2px",
            }}
            fontSize="small"
          />
        </button>
      </form>
      <button className="cancel-del" onClick={cancelDelete}>
        x
      </button>
    </div>
  );
};

export default LogDeleteForm;
