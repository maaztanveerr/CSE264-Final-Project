// src/pages/MyRsvpsPage.jsx
import { useRsvp } from '../RsvpContext.jsx'
import EventCard from '../components/EventCard.jsx';

function MyRsvpsPage() {
  const { myRsvps } = useRsvp();

  //removing duplicates if user RSVPed more than once
  const uniqueEvents = Array.from(
    new Map(myRsvps.map((e) => [e.id, e])).values()
  )

  return (
    <div className="rsvp-page">
      <h2>My RSVPs</h2>
      
      {uniqueEvents.length === 0 ? (
        <p>You have not RSVP'd to any events yet.</p>
      ) : (
        <div className="rsvp-list">
          {uniqueEvents.map((event) => (
            <EventCard key={event.id} event={event}/>
          ))}
        </div>
      )}
    </div>
  );
}
export default MyRsvpsPage;
