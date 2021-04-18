import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createLogEntry } from "../API";

// Form to input your trip title
const LogTitleForm = ({ handleClick, googleId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      data.googleId = googleId;
      await createLogEntry(data);
      handleClick();
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="entry-form">
      {error ? <h3 className="error">{error}</h3> : null}
      <input name="title" required ref={register} />
      <button disabled={loading}>
        {loading ? "Loading..." : "Create Entry"}
      </button>
    </form>
  );
};

export default LogTitleForm;
