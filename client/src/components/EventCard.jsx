import { Link } from "react-router-dom"
import { motion } from "framer-motion" // new animation library

function EventCard({ event }) {
  const formattedDate = new Date(event.start).toLocaleString();

  return (
    <motion.div
      className="event-card"
      // how the card looks when it first appears
      initial={{ opacity: 0, y: 10 }}
      // how it should look after the animation finishes
      animate={{ opacity: 1, y: 0 }}
      // small zoom-in on hover
      whileHover={{ scale: 1.02 }}
      // how fast / smooth the animation is
      transition={{ duration: 0.2 }}
    >
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

      <Link to={`/events/${event.id}`}>
        <button>View Details</button>
      </Link>
    </motion.div>

  )
}

export default EventCard