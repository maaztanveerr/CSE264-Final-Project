// src/pages/EventDetailPage.jsx
import { useParams } from 'react-router-dom'
import { useEvents } from '../EventContext.jsx'
import { useRsvp } from '../RsvpContext.jsx'
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../CurrentUserContext.jsx"
import { useState, useEffect } from "react";

//Add weather and location data from API to this page! done
function EventDetailPage() {
  const { id } = useParams()
  const { getEventById } = useEvents()
  const { myRsvps, rsvpToEvent, cancelRsvp } = useRsvp()
  const { currentUser } = useCurrentUser()

  const navigate = useNavigate()

  const event = getEventById(id)

  // WEATHER !!!
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);

  useEffect(() => {
    // if we somehow have no event do nothing
    if (!event) return;

    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

    // if no key then fail
    if (!apiKey) {
      console.warn("VITE_OPENWEATHER_API_KEY is not set");
      return;
    }

    async function fetchWeather() {
      try {
        setWeatherLoading(true);
        setWeatherError(null);

        // hopefully works for Bethlehem, PA
        //can change later to something else if u want
        // i tried doing locationText but openweather expects a city/state or zip etc
        // the hardcoded location we have at the moment is steps so doesnt worj that easily
        // would need to customize database for city for this to work
        const cityQuery = encodeURIComponent("Bethlehem,PA,US");

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityQuery}&units=imperial&appid=${apiKey}`;

        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`weather fetch failed with status ${res.status}`);
        }

        const data = await res.json();

        // pull out only what we care about
        const temp = data.main?.temp;
        const feelsLike = data.main?.feels_like;
        const description = data.weather?.[0]?.description;

        setWeather({
          temp,
          feelsLike,
          description,
        });

      } catch (err) {
        console.error("failed to load weather", err);
        setWeatherError("Could not load weather right now.");
      } finally {
        setWeatherLoading(false);
      }
    }

    fetchWeather();
  }, [event]); // rerun if event changes

  if (!event) return <p>Event not found.</p>

  // check if this event is already in RSVPs list
  const isGoing = myRsvps.some((e) => e.id === event.id)

  const formattedDate = new Date(event.start).toLocaleString()

  // this runs only when the button is clicked
  const handleRsvpClick = async () => {
    if (!currentUser) {
      alert("No user is logged in yet.");
      return;
    }

    try {
      if (isGoing) {
        // user already RSVPd so cancel it
        await cancelRsvp(currentUser.id, event.id)
        alert(`Canceled RSVP for ${event.title}.`)
      } else {
        // user not RSVPd yet so create RSVP
        await rsvpToEvent(currentUser.id, event)
        alert(`Successfully RSVP'd to ${event.title}!`)
      }
    } catch (err) {
      console.error("problem updating rsvp", err)
      alert("Something went wrong updating your RSVP.")
    }
  }


  return (
    <div className="event-detail">
      <table className="event-table">
        <thead>
          <tr>
            <th colSpan="2">{event.title}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="label-cell">Description</td>
            <td>{event.description}</td>
          </tr>
          <tr>
            <td className="label-cell">Date</td>
            <td>{formattedDate}</td>
          </tr>
          <tr>
            <td className="label-cell">Location</td>
            <td>{event.locationText}</td>
          </tr>
          <tr>
            <td className="label-cell">Category</td>
            <td>{event.category}</td>
          </tr>
        </tbody>
      </table>

      <div className="event-detail-buttons">
        <button onClick={() => navigate(-1)}>Back</button>
        <button onClick={handleRsvpClick}>
          {isGoing ? "Cancel RSVP" : "RSVP"}
        </button>
      </div>

      {/* location and weather together */}
      <div className="location-and-weather">
        <div className="map-card">
          <h3>Map</h3>
          <iframe
            title="Event location map"
            width="100%"
            height="260"
            style={{ border: 0, borderRadius: "8px" }}
            loading="lazy"
            allowFullScreen
            src={
              "https://www.google.com/maps?q=" +
              encodeURIComponent(event.locationText + ", Lehigh University, Bethlehem, PA") +
              "&output=embed"
            }
          />
        </div>

        <div className="event-weather">
          <h3>Weather Forecast:</h3>

          {weatherLoading && <p>Loading weather...</p>}

          {weatherError && <p>{weatherError}</p>}

          {weather && !weatherLoading && !weatherError && (
            <div className="event-weather-body">
              <p>
                <span className="weather-label">Current:</span>{" "}
                {Math.round(weather.temp)}°F
              </p>
              <p>
                <span className="weather-label">Feels like:</span>{" "}
                {Math.round(weather.feelsLike)}°F
              </p>
              <p>
                <span className="weather-label">Conditions:</span>{" "}
                {weather.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>


  )
}
export default EventDetailPage
