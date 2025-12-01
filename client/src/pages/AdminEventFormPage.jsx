// src/pages/AdminEventFormPage.jsx
import { useNavigate, useParams } from "react-router-dom"
import { useEvents } from "../EventContext.jsx"
// import { currentUser } from "../currentUser.js"
import EventForm from "../components/EventForm.jsx"
import { useCurrentUser } from "../CurrentUserContext.jsx"


function AdminEventFormPage() {
  const { id } = useParams()
  //keeping track of whether editing event or making new one
  const isEdit = Boolean(id)
  const { getEventById, addEvent, updateEvent } = useEvents()
  const navigate = useNavigate()
  const { currentUser, userLoading } = useCurrentUser();

  if (userLoading) {
    return <p>Loading user...</p>;
  }

  if (!currentUser || currentUser.role !== "admin") {
    return <p>You don't have permission to view this page.</p>;
  }

  const existingEvent = isEdit ? getEventById(id) : null

  // tiny changes: made it async and added error checking for that as well to fit in with everything else
  const handleSubmit = async (formData) => {
    try {
      if(isEdit){
        await updateEvent(id, formData)
        // go back to admin dashboard after successful edit
        navigate('/admin')
      }else{ // create new event
          const newEvent = await addEvent(formData)
          //then nav to new event detail when added
          navigate(`/events/${newEvent.id}`)
      }
    } catch (err) {
      console.error('failed to save event', err)
    }
  }

  if(isEdit && !existingEvent){
    return <p>Event not found.</p>
  }

  return(
    <div className="admin-form-page">
        <h2>{isEdit ? "Edit Event" : "Create Event"}</h2>
        <EventForm initialValues={existingEvent} onSubmit={handleSubmit}/>
    </div>
  )
}
export default AdminEventFormPage;