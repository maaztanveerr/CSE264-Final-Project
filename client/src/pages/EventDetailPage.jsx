// src/pages/EventDetailPage.jsx
import { useParams } from 'react-router-dom'
import { useEvents } from '../EventContext.jsx'
import { useRsvp } from '../RsvpContext.jsx'
import { useNavigate } from "react-router-dom";

function EventDetailPage() {
    const { id } = useParams()
    const { getEventById } = useEvents()
    const { rsvpToEvent } = useRsvp()

    const navigate = useNavigate()

    const event = getEventById(id)

    if (!event) return <p>Event not found.</p>

    const handleRsvp = () =>{
        rsvpToEvent(event)
        alert(`Successfully RSVP'd to ${event.title}!`)
    }

    const formattedDate = new Date(event.start).toLocaleString()
    
  return (
    <div className="event-detail">
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

      <div className="event-detail-buttons">
        <button onClick={() => navigate(-1)}>Back</button>
        <button onClick={handleRsvp}>RSVP</button>
      </div>
    </div>

    
  );
}
export default EventDetailPage
