// src/pages/AdminEventFormPage.jsx
import { useNavigate, useParams } from "react-router-dom"
import { useEvents } from "../EventContext.jsx"
import { currentUser } from "../currentUser.js"
import EventForm from "../components/EventForm.jsx"


function AdminEventFormPage() {
  const { id } = useParams()
  //keeping track of whether editing event or making new one
  const isEdit = Boolean(id)
  const { getEventById, addEvent, updateEvent } = useEvents()
  const navigate = useNavigate()

  if(currentUser.role !== "admin"){
    return <p>You don't have permission to view this page.</p>
  }

  const existingEvent = isEdit ? getEventById(id) : null

  const handleSubmit = (formData) => {
    if(isEdit){
        updateEvent(id, formData)
    }else{
        const newEvent = addEvent(formData)
        //then nav to new event detail when added
        navigate(`/events/${newEvent.id}`)
        return
    }
    navigate('/admin')
  }

  if(isEdit && !existingEvent){
    return <p>Event not found.</p>
  }

  return(
    <div>
        <h2>{isEdit ? "Edit Event" : "Create Event"}</h2>
        <EventForm initialValues={existingEvent} onSubmit={handleSubmit}/>
    </div>
  )
}
export default AdminEventFormPage;