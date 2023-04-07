import { React, useState, useRef } from "react";
import { ref, update, child, get } from "firebase/database";
import { database, auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const LogIn = () => {
  async function updateUserData(userID, newDate) {
    const userRef = ref(database, "users/" + userID);
    try {
      await update(userRef, {
        dateLoggedIn: [
          ...((await get(child(userRef, "dateLoggedIn"))).val() || []),
          newDate,
        ],
      });
      console.log("Data added successfully!");
    } catch (error) {
      console.log("Error adding data:", error);
    }
  }
  const nameInputRef = useRef();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = nameInputRef.current.value;
    const password = "password";

    signInWithEmailAndPassword(auth, name, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        const userID = user.uid;
        updateUserData(userID, { date: new Date(), timeperiod: Date.now() });
        navigate("/info");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMessage(errorMessage);
      });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div>
        <input
          className="input-field"
          type="text"
          id="nameInput"
          ref={nameInputRef}
        />
        <button className="login-btn" type="submit"></button>
      </div>
      {/* <div>
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" ref={passwordInputRef} />
      </div> */}
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};

export default LogIn;
