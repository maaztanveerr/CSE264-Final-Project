function EventFilters({ filters, setFilters }) {
  return (
    <div className="filters">
      <input
        placeholder="Search events..."
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      />

      <select
        value={filters.category}
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
      >
        {/*All diff options for filtering*/}
        <option value="">All Categories</option>
        <option value="Engineering">Engineering</option>
        <option value="Social">Social</option>
        <option value="Cultural">Cultural</option>
        <option value="Arts & Music">Arts & Music</option>
        <option value="Sports">Sports</option>
        <option value="Business">Business</option>
      </select>
    </div>
  )
}

export default EventFilters
