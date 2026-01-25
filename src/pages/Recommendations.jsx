import { useState, useMemo } from 'react';
import BookCard from '../components/BookCard';
import MemberFilter from '../components/MemberFilter';
import recommendations from '../data/recommendations.json';

function Recommendations() {
  const [selectedMember, setSelectedMember] = useState('');

  // Get unique list of members who have made recommendations
  const members = useMemo(() => {
    const memberSet = new Set(recommendations.map((rec) => rec.recommendedBy));
    return Array.from(memberSet).sort();
  }, []);

  // Filter recommendations based on selected member
  const filteredRecommendations = useMemo(() => {
    if (!selectedMember) {
      return recommendations;
    }
    return recommendations.filter((rec) => rec.recommendedBy === selectedMember);
  }, [selectedMember]);

  return (
    <div>
      <div className="page-header">
        <h1>Member Recommendations</h1>
        <p>
          Discover your next favorite read! Our members share their top picks
          and explain why these books deserve a spot on your reading list.
        </p>
      </div>

      <MemberFilter
        members={members}
        selectedMember={selectedMember}
        onMemberChange={setSelectedMember}
      />

      {filteredRecommendations.length > 0 ? (
        <div className="book-grid">
          {filteredRecommendations.map((book) => (
            <BookCard key={book.id} book={book} type="recommendation" />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">&#128270;</div>
          <p>No recommendations found for this member.</p>
        </div>
      )}
    </div>
  );
}

export default Recommendations;
