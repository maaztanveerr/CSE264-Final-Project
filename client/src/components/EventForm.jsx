import { useState } from "react"

const CATEGORIES = [
    '',
    "Engineering",
    "Social",
    "Cultural",
    "Arts & Music",
    "Sports",
    "Business",
]

function EventForm({initialValues, onSubmit }){
    const [form, setForm] = useState(
        initialValues || {
            title: "",
            description: "",
            category: "",
            start: "",
            end: "",
            locationText: "", 
        }
    )

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((f) => ({...f, [name]: value}))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(form)
    }

    return (
        <form className='event-form' onSubmit={handleSubmit}>
            <label>
                Title
                <input name='title' value={form.title} onChange={handleChange} required />

            </label>

            <label>
                Description
                <textarea name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                />
            </label>

            <label>
                Category
                <select name="category"
                value={form.category}
                onChange={handleChange}
                >
                    {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                        {c === "" ? "All Categories" : c}
                    </option>
                ))}
                </select>
            </label>

            <label>
                Start
                <input type="datetime-local" name="start"
                value={form.start}
                onChange={handleChange}
                required
                />
            </label>

            <label>
                End
                <input type="datetime-local" name="end"
                value={form.end}
                onChange={handleChange}
                required
                />
            </label>
            <label>
                Location
                <input name="locationText" value={form.locationText}
                onChange={handleChange}
                required
                />
            </label>
            <button type="submit">Save Event</button>

        </form>
    )
}

export default EventForm