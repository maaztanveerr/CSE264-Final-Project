function EventFilters({ filters, setFilters }) {
  return (
    <div className="filters">
      {/* event search*/}
      <input
        placeholder="Search events..."
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      />
      {/* category dropdown */}
      <select
        value={filters.category}
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
      >
        {/*All diff options for filtering by category*/}
        <option value="">All Categories</option>
        <option value="Engineering">Engineering</option>
        <option value="Social">Social</option>
        <option value="Cultural">Cultural</option>
        <option value="Arts & Music">Arts & Music</option>
        <option value="Sports">Sports</option>
        <option value="Business">Business</option>
      </select>

      {/* date picker */}
      <input
        type="date"
        value={filters.date || ""}
        onChange={(e) =>
          setFilters({ ...filters, date: e.target.value})
        }
        />
    </div>
  )
}

export default EventFilters