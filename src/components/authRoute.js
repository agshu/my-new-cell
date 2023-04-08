import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

// can be used on routes to make them need authorization

const AuthRoute = (props) => {
  const { children } = props;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const AuthCheck = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoading(false);
      } else {
        navigate("/");
      }
    });

    return () => AuthCheck(); // makes user kicked out from route if signing out
  }, [auth]);

  if (loading) return <p>loading...</p>;

  return <div>{children}</div>;
};

export default AuthRoute;
