function MemberFilter({ members, selectedMember, onMemberChange }) {
  return (
    <div className="filter-container">
      <label htmlFor="member-filter" className="filter-label">
        Filter by Member:
      </label>
      <select
        id="member-filter"
        className="filter-select"
        value={selectedMember}
        onChange={(e) => onMemberChange(e.target.value)}
      >
        <option value="">All Members</option>
        {members.map((member) => (
          <option key={member} value={member}>
            {member}
          </option>
        ))}
      </select>
    </div>
  );
}

export default MemberFilter;
