import {Link} from "react-router-dom"

function EventCard({event}){
    const formattedDate = new Date(event.start).toLocaleString();
    return (
        <div className="event-card">
      <table className="event-table">
        <thead>
          <tr>
            <th colSpan="2">{event.title}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="label-cell">Description</td>
            <td>{event.description}</td>
          </tr>
          <tr>
            <td className="label-cell">Date</td>
            <td>{formattedDate}</td>
          </tr>
          <tr>
            <td className="label-cell">Location</td>
            <td>{event.locationText}</td>
          </tr>
          <tr>
            <td className="label-cell">Category</td>
            <td>{event.category}</td>
          </tr>
        </tbody>
      </table>

      <Link to={`/events/${event.id}`}>
        <button>View Details</button>
      </Link>
    </div>

    )
}

export default EventCard