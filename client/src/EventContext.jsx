import { createContext, useContext, useState, useEffect } from "react"

const API_BASE_URL = "http://localhost:3000"; // backend express server

const EventContext = createContext()

// // events come from the backend api, not a hardcoded array now
// const initialEvents = [ //edit this to work w database API to get events
//   {
//     id: "1",
//     title: "Hackathon Night",
//     description: "48-hour coding event.",
//     start: "2025-11-30T18:00:00",
//     end: "2025-11-30T23:00:00",
//     category: "Engineering",
//     locationText: "STEPS Lehigh University",
//   },
//   {
//     id: "2",
//     title: "Business Club Networking",
//     description: "Meet alumni and recruiters.",
//     start: "2025-12-02T19:00:00",
//     end: "2025-12-02T21:00:00",
//     category: "Business",
//     locationText: "Rauch Business Center",
//   },
// ]

export function EventProvider({ children }) {
  const [events, setEvents] = useState([]); // start with empty list
  const [loading, setLoading] = useState(true); // true until we load from api
  const [error, setError] = useState(null); // store any error message

  // load events from the backend once when this provider mounts
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE_URL}/api/events`); // actually call the backend now

        if (!res.ok) {
          throw new Error(`failed to fetch events: ${res.status}`);
        }

        const data = await res.json();

        // make sure ids are strings 
        const normalized = data.map((e) => ({
          ...e,
          id: e.id.toString(),
        }));

        setEvents(normalized);
      } catch (err) { 
        console.error("error loading events", err);
        // instead of showing just an error use the backup
        // const normalized = initialEvents.map((e) => ({
        //   ...e,
        //   id: e.id.toString(),
        // }));
        // setEvents(normalized);

        // // no "fatal" error for the UI, so leave error as null
        setError("Failed to load events from server");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // create a new event by calling the backend
  const addEvent = async (eventData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // send the form data as json body
        body: JSON.stringify(eventData),
      });

      if (!res.ok) { // check if worked
        throw new Error("failed to create event");
      }

      // event that comes back from the server 
      const created = await res.json();

      // make sure id is a string for react
      const normalized = {
        ...created,
        id: created.id.toString(),
      };

      // add it
      setEvents((prev) => [...prev, normalized]);

      return normalized;
    } catch (err) {
      console.error("error in addEvent", err);
      throw err;
    }
  };

  // update an event on the backend
  const updateEvent = async (id, updates) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        // send only the updated data
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        throw new Error(`failed to update event ${id}`);
      }

      const updated = await res.json();

      const normalized = {
        ...updated,
        id: updated.id.toString(),
      };

      // replace the old event with updated one
      setEvents((prev) =>
        prev.map((e) => (e.id === normalized.id ? normalized : e))
      );

      return normalized;
    } catch (err) {
      console.error("error in updateEvent", err);
      throw err;
    }
  };

  // delete an event on the backend
  const deleteEvent = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/events/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`failed to delete event ${id}`);
      }

      // if server delete worked remove locally too
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("error in deleteEvent", err);
      throw err;
    }
  };

  const getEventById = (id) => events.find((e) => e.id === id)

  return (
    <EventContext.Provider
      value={{ events, loading, error, addEvent, updateEvent, deleteEvent, getEventById }}
    >
      {children}
    </EventContext.Provider>
  )
}

export function useEvents() {
  return useContext(EventContext);
}
