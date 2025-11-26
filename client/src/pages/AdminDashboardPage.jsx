// src/pages/AdminDashboardPage.jsx
import { Link } from "react-router-dom";
import { useEvents } from "../EventContext.jsx";
import { currentUser } from "../currentUser.js";

function AdminDashboardPage() {
    const { events, deleteEvent } = useEvents();

    if (currentUser.role !== "admin") {
        return <p>You do not have permission to view this page.</p>;
    }

    return (
        <div>
        <h2>Admin – Manage Events</h2>
        {/*creating a new event*/}
        <Link to="/admin/events/new">
            <button>Create New Event</button>
        </Link>

        <table className="admin-table">
            <thead>
            <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Location</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {events.map((e) => (
                <tr key={e.id}>
                <td>{e.title}</td>
                <td>{e.category}</td>
                <td>{new Date(e.start).toLocaleString()}</td>
                <td>{e.locationText}</td>
                <td>
                    {/*editing an event*/}
                    <Link to={`/admin/events/${e.id}/edit`}>
                    <button>Edit</button>
                    </Link>
                    <button onClick={() => deleteEvent(e.id)}>Delete</button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
}

export default AdminDashboardPage;
