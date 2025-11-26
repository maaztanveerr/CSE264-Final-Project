import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RsvpProvider } from "./RsvpContext.jsx"
import { EventProvider } from './EventContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/*wrapping in event provider to show events*/}
    <EventProvider>
      {/* wrapping app in RSVP provider to show RSVPs*/}
      <RsvpProvider>
        <App />
      </RsvpProvider>
    </EventProvider>
  </StrictMode>,
)
