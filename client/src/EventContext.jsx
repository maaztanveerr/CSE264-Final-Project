import { createContext, useContext, useState } from "react"

const EventContext = createContext()

const initialEvents = [ //edit this to work w database API to get events
    {
        id: "1",
        title: "Hackathon Night",
        description: "48-hour coding event.",
        start: "2025-11-30T18:00:00",
        end: "2025-11-30T23:00:00",
        category: "Engineering",
        locationText: "STEPS 102",
    },
    {
        id: "2",
        title: "Business Club Networking",
        description: "Meet alumni and recruiters.",
        start: "2025-12-02T19:00:00",
        end: "2025-12-02T21:00:00",
        category: "Business",
        locationText: "Rauch 184",
    },
]

export function EventProvider({ children }) {
  const [events, setEvents] = useState(initialEvents)

  const addEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: Date.now().toString(),
    }
    setEvents((prev) => [...prev, newEvent])
    return newEvent;
  };

  const updateEvent = (id, updates) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    )
  }

  const deleteEvent = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  const getEventById = (id) => events.find((e) => e.id === id)

  return (
    <EventContext.Provider
      value={{ events, addEvent, updateEvent, deleteEvent, getEventById }}
    >
      {children}
    </EventContext.Provider>
  )
}

export function useEvents() {
  return useContext(EventContext);
}
