import { Link } from "react-router-dom"
import { useCurrentUser } from "../CurrentUserContext.jsx"

function NavBar() {
    const { currentUser } = useCurrentUser()
    return (
        <header className="navbar">
            <div className="navbar-inner">

                {/* Left side */}
                <div className="navbar-logo">
                    <Link to="/">
                        <img src="eblogo.png" alt="EventBoard Logo" className="eb-logo" />
                    </Link>
                    <Link to="/events">EventBoard</Link>
                    {/*add welcome (user) at top (did this)*/}
                </div>

                {/* Right side */}
                <nav className="navbar-links">
                    {/* only show hello if we actually have a user */}
                    {currentUser && <span>Hi, {currentUser.name}</span>}

                    <Link to="/events">Events</Link>
                    <Link to="/me/rsvps">My RSVPS</Link>
                    {currentUser && currentUser.role === "admin" && (
                        <Link to="/admin">Admin</Link>
                    )}
                </nav>

            </div>
        </header>
    )
}

export default NavBar

// FIX