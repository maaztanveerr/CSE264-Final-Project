// src/pages/EventListPage.jsx
import {useState, useEffect} from 'react'
import EventFilters from '../components/EventFilters.jsx';
import EventCard from '../components/EventCard.jsx'
import {useEvents} from '../EventContext.jsx'


function EventListPage() {
    const { events } = useEvents()
    const [filters, setFilters] = useState({ search: "", category: "", date: "", })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)


    //later will wrap fetch() calls
    if(loading) return <p>Loading events...</p>
    if(error) return <p>Failed to load events.</p>

    const filtered = events.filter(e => {
        const matchesSearch = e.title.toLowerCase().includes(filters.search.toLowerCase())
        const matchesCategory = filters.category ? e.category === filters.category : true


        // date filter
        let matchesDate = true
        if (filters.date){
            const eventDateStr = e.start.split("T")[0]
            matchesDate = eventDateStr === filters.date
        }

        return matchesSearch && matchesCategory && matchesDate;
    })

    const sorted = [...filtered].sort(
        (a,b) => new Date(a.start) - new Date(b.start)
    )

    return (
        <>
            <h2>Welcome to EventBoard! View upcoming campus events below.</h2>
            <h4>Press "View Details" to see more information and RSVP.</h4>
            <EventFilters filters={filters} setFilters={setFilters} />
            <h2>Upcoming Events</h2>
            <div className="event-grid">
                {sorted.map((event) =>(
                    <EventCard key={event.id} event={event}/>
                ))}
            </div>
        </>
    )
}
export default EventListPage
