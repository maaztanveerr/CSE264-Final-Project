// // src/CurrentUserContext.jsx

// // !! made this for now but im not incorporating it in the rest of the code
// // we can do that after we get database permission

// // basically we ask the backend "/api/login" for a user from the database, store that user
// // and let rest of the app read currentUser and their role ("Admin" or "Student")

// import { createContext, useContext, useEffect, useState } from "react";
// // import { currentUser as hardcodedUser } from "./currentUser.js";

// const API_BASE_URL = "http://localhost:3000";

// // this will store currentUser info
// const CurrentUserContext = createContext();

// export function CurrentUserProvider({ children }) {
//   const [currentUser, setCurrentUser] = useState(null); // will store id, name, email, role
//   const [userLoading, setUserLoading] = useState(true); // start as true since we are about to fetch
//   const [userError, setUserError] = useState(null);

//   // im also doing a sort of fake login using hardcoded email so
//   // the app always has a user 
//   useEffect(() => {
//     async function autoLogin() {
//       try {
//         setUserLoading(true);
//         setUserError(null);

//         // call relevant backend 
//         // for now we always log in as dylan (admin) (wont work right now cuz database permission thing)
//         const res = await fetch(`${API_BASE_URL}/api/login`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email: "dts226@lehigh.edu" }),
//         });

//         // check if something went wrong
//         if (!res.ok) {
//           throw new Error(`login failed with status ${res.status}`);
//         }

//         const data = await res.json();

//         // save the user so the rest of the app can use it
//         setCurrentUser(data.user);
//       } catch (err) {
//         console.error("error during auto login, using backup user", err);
//         setUserError("using local fallback user");
//         // because of db permissions thing for now use the hardcoded user
//         setCurrentUser(hardcodedUser);
//       } finally {
//         setUserLoading(false);
//       }
//     }

//     autoLogin();
//   }, []);

//   return (
//     <CurrentUserContext.Provider
//       value={{ currentUser, userLoading, userError }}
//     >
//       {children}
//     </CurrentUserContext.Provider>
//   );
// }

// // helper 
// export function useCurrentUser() {
//   return useContext(CurrentUserContext);
// }

// src/CurrentUserContext.jsx
// Holds the currently logged-in user and simple login/logout helpers.

import { createContext, useContext, useState } from "react"

const API_BASE_URL = "http://localhost:3000"

const CurrentUserContext = createContext()

export function CurrentUserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)   // {id, name, email, role}
  const [userLoading, setUserLoading] = useState(false)
  const [userError, setUserError] = useState(null)

  // call backend /api/login with an email
  const login = async (email) => {
    try {
      setUserLoading(true)
      setUserError(null)

      const trimmed = email.trim()
      if (!trimmed) {
        throw new Error("Email is required")
      }

      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      })

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Invalid email")
        }
        throw new Error(`Login failed with status ${res.status}`)
      }

      const data = await res.json()

      // normalize role to lowercase so we can compare to "admin"/"student"
      const normalizedUser = {
        ...data.user,
        role: data.user.role ? data.user.role.toLowerCase() : "",
      }

      setCurrentUser(normalizedUser)
      return normalizedUser
    } catch (err) {
      console.error("error during login", err)
      setCurrentUser(null)
      setUserError(err.message || "Login failed")
      throw err
    } finally {
      setUserLoading(false)
    }
  }

  const logout = () => {
    setCurrentUser(null)
    setUserError(null)
  }

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, userLoading, userError, login, logout }}
    >
      {children}
    </CurrentUserContext.Provider>
  )
}

export function useCurrentUser() {
  return useContext(CurrentUserContext)
}