import {Link} from "react-router-dom"
import { currentUser} from "../currentUser.js"

function NavBar(){
    return(
        <header className="navbar">
            <div className="navbar-inner">
        
                {/* Left side */}
                <div className="navbar-logo">
                    <a href="/">
                        <img src="eblogo.png" alt="EventBoard Logo" className="eb-logo"/>
                    </a>
                    <Link to="/events">EventBoard</Link>
                {/*add welcome (user) at top*/}
                </div>

                {/* Right side */}
                <nav className="navbar-links">
                <Link to="/events">Events</Link>
                <Link to="/me/rsvps">My RSVPS</Link>
                {currentUser.role === "admin" && <Link to="/admin">Admin</Link>}
                </nav>

            </div>
        </header>
    )
}

export default NavBar