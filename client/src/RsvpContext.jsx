import { createContext, useContext, useState } from "react"

const API_BASE_URL = "http://localhost:3000";
//using context
const RsvpContext = createContext()

export function RsvpProvider({ children }) {
    const [myRsvps, setMyRsvps] = useState([])
    const [rsvpLoading, setRsvpLoading] = useState(false)
    const [rsvpError, setRsvpError] = useState(null)

    // load all rsvps for a user from backend
    const loadRsvps = async (userId) => {
        try {
            setRsvpLoading(true)
            setRsvpError(null)

            const res = await fetch(`${API_BASE_URL}/api/rsvps/${userId}`)
            if (!res.ok) {
                throw new Error(`failed to load rsvps: ${res.status}`)
            }

            const data = await res.json() // array of events
            const normalized = data.map((e) => ({
                ...e,
                id: e.id.toString(),
            }))

            setMyRsvps(normalized)
        } catch (err) {
            console.error('error loading rsvps', err)
            setRsvpError('failed to load rsvps')
        } finally {
            setRsvpLoading(false)
        }
    }

    // create a new rsvp for this user and event
    const rsvpToEvent = async (userId, event) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/rsvps`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, eventId: event.id }),
            })

            if (!res.ok) {
                throw new Error(`failed to create rsvp: ${res.status}`)
            }

            // add event locally if not already present
            setMyRsvps((prev) => {
                if (prev.some((e) => e.id === event.id)) {
                    return prev
                }
                return [...prev, event]
            })
        } catch (err) {
            console.error('error creating rsvp', err)
            throw err
        }
    }

    // delete an rsvp for this user and event
    const cancelRsvp = async (userId, eventId) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/rsvps/${userId}/${eventId}`, {
                method: "DELETE",
            })

            if (!res.ok) {
                throw new Error(`failed to delete rsvp: ${res.status}`)
            }

            setMyRsvps((prev) => prev.filter((e) => e.id !== eventId))
        } catch (err) {
            console.error('error deleting rsvp', err)
            throw err
        }
    }

    return (
        <RsvpContext.Provider
            value={{ myRsvps, rsvpLoading, rsvpError, loadRsvps, rsvpToEvent, cancelRsvp }}
        >
            {children}
        </RsvpContext.Provider>
    );
}

export function useRsvp() {
    return useContext(RsvpContext)
}
