// src/CurrentUserContext.jsx

// !! made this for now but im not incorporating it in the rest of the code
// we can do that after we get database permission

// basically we ask the backend "/api/login" for a user from the database, store that user
// and let rest of the app read currentUser and their role ("Admin" or "Student")

import { createContext, useContext, useEffect, useState } from "react";
import { currentUser as hardcodedUser } from "./currentUser.js";

const API_BASE_URL = "http://localhost:3000";

// this will store currentUser info
const CurrentUserContext = createContext();

export function CurrentUserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); // will store id, name, email, role
  const [userLoading, setUserLoading] = useState(true); // start as true since we are about to fetch
  const [userError, setUserError] = useState(null);

  // im also doing a sort of fake login using hardcoded email so
  // the app always has a user 
  useEffect(() => {
    async function autoLogin() {
      try {
        setUserLoading(true);
        setUserError(null);

        // call relevant backend 
        // for now we always log in as dylan (admin) (wont work right now cuz database permission thing)
        const res = await fetch(`${API_BASE_URL}/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "dts226@lehigh.edu" }),
        });

        // check if something went wrong
        if (!res.ok) {
          throw new Error(`login failed with status ${res.status}`);
        }

        const data = await res.json();

        // save the user so the rest of the app can use it
        setCurrentUser(data.user);
      } catch (err) {
        console.error("error during auto login, using backup user", err);
        setUserError("using local fallback user");
        // because of db permissions thing for now use the hardcoded user
        setCurrentUser(hardcodedUser);
      } finally {
        setUserLoading(false);
      }
    }

    autoLogin();
  }, []);

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, userLoading, userError }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
}

// helper 
export function useCurrentUser() {
  return useContext(CurrentUserContext);
}