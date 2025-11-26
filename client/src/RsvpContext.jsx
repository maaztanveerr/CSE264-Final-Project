import { createContext, useContext, useState } from "react"
//using context
const RsvpContext = createContext()

export function RsvpProvider({ children }) {
    const [myRsvps, setMyRsvps] = useState([])

    const rsvpToEvent = (event) => {
        setMyRsvps(prev => [...prev, event])
    };

    return (
        <RsvpContext.Provider value={{ myRsvps, rsvpToEvent }}>
            {children}
        </RsvpContext.Provider>
    );
}

export function useRsvp() {
  return useContext(RsvpContext)
}
