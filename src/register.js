import React from "react";
import { useState } from "react";
import { ref, set } from "firebase/database";
import { database, auth } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const Register = () => {
  async function writeUserData(name, userID) {
    try {
      await set(ref(database, "users/" + userID), {
        username: name,
        dateLoggedIn: new Date(),
        dateSeconds: Date.now(),
        clickedButton: 0,
      });
    } catch (error) {
      console.log(error);
    }
  }
  const [name, setName] = useState("");

  function handleNameChange(event) {
    setName(event.target.value);
  }

  // function handlePasswordChange(event) {
  //   setPassword(event.target.value);
  // }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        name,
        "password"
      );
      const user = userCredential.user;
      const userID = user.uid;
      await writeUserData(name, userID);
      // redirect to info.html after data is inserted into the database
      //window.location.href = "/info.html";
    } catch (error) {
      alert(error.message);
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <input
        id="nameInput"
        type="text"
        value={name}
        onChange={handleNameChange}
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
