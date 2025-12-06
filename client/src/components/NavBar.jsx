// src/components/NavBar.jsx
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCurrentUser } from "../CurrentUserContext.jsx"

function NavBar() {
    const { currentUser, userLoading, userError, login, logout } = useCurrentUser()
    const [emailInput, setEmailInput] = useState("")
    const navigate = useNavigate()

    const handleLoginSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(emailInput)
      setEmailInput("")
      navigate("/events")
    } catch {
      // error message already stored in userError
    }
    }

    const handleLogout = () => {
        logout()
        navigate("/events")
    }

    return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Left side */}
        <div className="navbar-logo">
          <Link to="/">
            <img src="eblogo.png" alt="EventBoard Logo" className="eb-logo" />
          </Link>
          <Link to="/events">EventBoard</Link>
        </div>

        {/* Right side */}
        <nav className="navbar-links">
          <Link to="/events">Events</Link>
          <Link to="/me/rsvps">My RSVPS</Link>

          {currentUser ? (
            <>
              <span>Hi, {currentUser.name}</span>
              {currentUser.role === "admin" && (
                <Link to="/admin">Admin</Link>
              )}
              <button
                type="button"
                className="navbar-button"
                onClick={handleLogout}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <form
                className="navbar-login-form"
                onSubmit={handleLoginSubmit}
              >
                <input
                  type="email"
                  placeholder="Enter email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="navbar-login-input"
                />
                <button
                  type="submit"
                  className="navbar-button"
                  disabled={userLoading}
                >
                  {userLoading ? "Logging in..." : "Log in"}
                </button>
              </form>
              {userError && (
                <span className="navbar-error">
                  {userError}
                </span>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default NavBar
