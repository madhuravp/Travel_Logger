import React from "react";
import { useState, useEffect } from "react";
import Trips from "./components/Trips";
import { GoogleLogin } from "react-google-login";
import { GoogleLogout } from "react-google-login";
require("dotenv").config();

// Top level component which uses google Oauth 2.0 to authenticate the user.
const App = () => {
  const [googleId, setGoogleId] = useState(null);
  const [name, setName] = useState(null);
  const responseGoogle = (response) => {
    console.log(response);
    const { googleId } = response;
    const { wt } = response;
    setGoogleId(googleId);
    setName("User");
    console.log(googleId);
  };

  const logout = () => {
    setGoogleId(null);
  };

  return (
    <div>
      {googleId ? (
        <div>
          {" "}
          <Trips googleId={googleId} />{" "}
          <GoogleLogout
            className="logout"
            clientId={process.env.REACT_APP_CLIENT_ID}
            buttonText="Logout"
            onLogoutSuccess={logout}
          ></GoogleLogout>
        </div>
      ) : (
        <div>
          {" "}
          <h1 className="loginTitle">Login with gmail to see your trips!</h1>
          <GoogleLogin
            className="login"
            clientId={process.env.REACT_APP_CLIENT_ID}
            buttonText="Login"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={"single_host_origin"}
          />
        </div>
      )}
    </div>
  );
};

export default App;
