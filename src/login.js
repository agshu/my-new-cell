import { React, useState, useRef } from "react";
import { ref, update, child, get, onValue } from "firebase/database";
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
        const date = Date.now();
        const hasLoggedIn = ref(
          database,
          "users/" + user.uid + "/dateLoggedIn/"
        );

        onValue(hasLoggedIn, async (snapshot) => {
          const loggedValue = await snapshot.val();
          console.log(loggedValue.length);
          const date2 = Date.now() / 1000;
          if (loggedValue.length < 2) {
            navigate("/info");
          } else if (date2 < 1681290000) {
            navigate("/zero-phase");
          } else if (date2 > 1681290000 && date2 < 1681290300) {
            console.log("väntar på 09.57");
            navigate("/phase-one");
          } else if (date2 > 1681290300 && date2 < 1681290600) {
            navigate("/phase-two");
          } else if (date2 > 1681290600 && date2 < 1681290900) {
            console.log("hej");
            navigate("/phase-three");
          } else if (date2 > 1681290900) {
            navigate("/phase-four");
          } else {
            navigate("/zero-phase");
          }
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMessage(errorMessage);
        alert(
          "Användaren verkar inte finnas! Testa att registrera en ny användare nedan istället."
        );
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="logins">
        <input
          className="input-field animate__animated animate__fadeInLeft"
          placeholder="Logga in med din mail"
          type="text"
          id="nameInput"
          ref={nameInputRef}
        />
        <button
          className="login-btn animate__animated animate__fadeInLeft"
          type="submit"
        ></button>
      </div>
    </form>
  );
};

export default LogIn;
