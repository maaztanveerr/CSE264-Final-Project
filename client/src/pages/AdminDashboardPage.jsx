// src/pages/AdminDashboardPage.jsx
import { Link } from "react-router-dom";
import { useEvents } from "../EventContext.jsx";
// import { currentUser } from "../currentUser.js";
import { useCurrentUser } from "../CurrentUserContext.jsx";

function AdminDashboardPage() {
    const { events, deleteEvent } = useEvents();
    const { currentUser, userLoading } = useCurrentUser();

    if (userLoading) {
        return <p>Loading user...</p>;
    }

    if (!currentUser || currentUser.role !== "admin") {
        return <p>You do not have permission to view this page.</p>;
    }

    return (
        <div className="admin-page">
            <h2 className="admin-heading">Welcome Admin! Manage events below.</h2>
            {/*creating a new event*/}
            <div className="admin-actions">
                <Link to="/admin/events/new">
                    <button>Create New Event</button>
                </Link>
            </div>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Location</th>
                        {/* empty header cell for the buttons column */}
                        <th className="admin-actions-header"></th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((e) => (
                        <tr key={e.id}>
                            <td>{e.title}</td>
                            <td>{e.category}</td>
                            <td>{new Date(e.start).toLocaleString()}</td>
                            <td>{e.locationText}</td>
                            {/* buttons in their own (rightmost) column */}
                            <td className="admin-actions-cell">
                                <Link to={`/admin/events/${e.id}/edit`}>
                                    <button type="button"
                                    className="secondary-button admin-edit-button">Edit</button>
                                </Link>
                                <button  type="button"
                                    className="danger-button admin-delete-button" // again, only made it async to fit in with everything
                                    onClick={async () => {
                                        try {
                                            await deleteEvent(e.id)
                                        } catch (err) {
                                            console.error('failed to delete event', err)
                                        }
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminDashboardPage;
