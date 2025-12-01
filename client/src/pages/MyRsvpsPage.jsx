// src/pages/MyRsvpsPage.jsx
import { useRsvp } from '../RsvpContext.jsx'
import EventCard from '../components/EventCard.jsx';
import { useCurrentUser } from '../CurrentUserContext.jsx'
import { useEffect } from 'react'


function MyRsvpsPage() {
  const { currentUser } = useCurrentUser()
  const { myRsvps, rsvpLoading, rsvpError, loadRsvps } = useRsvp()

  //dont need this now as user cant rsvp multiple times now
  // //removing duplicates if user RSVPed more than once
  // const uniqueEvents = Array.from(
  //   new Map(myRsvps.map((e) => [e.id, e])).values()
  // )

  useEffect(() => {
    if (currentUser) {
      loadRsvps(currentUser.id)
    }
  }, [currentUser]) // ok for our project

  if (!currentUser) {
    return <p>You must be logged in to see your RSVPs.</p>
  }

  if (rsvpLoading) {
    return <p>Loading your RSVPs...</p>
  }

  if (rsvpError) {
    return <p>{rsvpError}</p>
  }


  return (
    <div className="rsvp-page">
      <h2>My RSVPs</h2>
      
      {myRsvps.length === 0 ? (
        <p>You have not RSVP'd to any events yet.</p>
      ) : (
        <div className="rsvp-list">
          {myRsvps.map((event) => (
            <EventCard key={event.id} event={event}/>
          ))}
        </div>
      )}
    </div>
  );
}
export default MyRsvpsPage;
