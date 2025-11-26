// src/pages/MyRsvpsPage.jsx
import { useRsvp } from '../RsvpContext.jsx'

function MyRsvpsPage() {
  const { myRsvps } = useRsvp();

  return (
    <div className="rsvp-page">
      <h2>My RSVPs:</h2>
      {myRsvps.length === 0 ? (
        <p>You have not RSVP'd to any events yet.</p>
      ) : (
        <ul>
          {myRsvps.map((e, idx) => (
            <li key={idx}>{e.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default MyRsvpsPage;
