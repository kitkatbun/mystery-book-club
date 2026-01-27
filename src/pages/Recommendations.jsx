import { useState, useEffect, useMemo } from 'react';
import BookCard from '../components/BookCard';
import RecommendationForm from '../components/RecommendationForm';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTLcNlM6aFplcFQY45w9OO1hgShJT0C3h7sTt2_boz7tskeWw_hhrzRcGHJCAL1hysbz-kq12_381Xp/pub?gid=7073202&single=true&output=csv';

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = parseCSVLine(lines[0]);

  return lines.slice(1).map((line, index) => {
    const values = parseCSVLine(line);
    const row = {};
    headers.forEach((header, i) => {
      row[header] = values[i] || '';
    });
    return { ...row, id: index + 1 };
  });
}

function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}

function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const typeLabels = {
    book: 'Book',
    tv: 'TV Show',
    movie: 'Movie',
    other: 'Other'
  };

  // Reverse mapping from Google Form labels to internal type keys
  const typeLabelToKey = {
    'Book': 'book',
    'TV Show': 'tv',
    'Movie': 'movie',
    'Other': 'other'
  };

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const response = await fetch(SHEET_URL);
        if (!response.ok) throw new Error('Failed to fetch');

        const text = await response.text();
        const data = parseCSV(text);

        // Map CSV columns to our data structure
        // Expected columns: Timestamp, Title, Type, Author, Platform, Custom Type, Your Name, Reason
        const mapped = data.map((row, index) => {
          const typeKey = typeLabelToKey[row['Type']] || 'other';
          return {
            id: index + 1,
            title: row['Title'] || '',
            type: typeKey,
            author: row['Author'] || '',
            platform: row['Platform'] || '',
            customType: row['Custom Type'] || '',
            recommendedBy: row['Your Name'] || '',
            reason: row['Reason'] || ''
          };
        }).filter(rec => rec.title); // Filter out empty rows

        setRecommendations(mapped);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Unable to load recommendations');
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  // Get unique list of members who have made recommendations
  const members = useMemo(() => {
    const memberSet = new Set(recommendations.map((rec) => rec.recommendedBy).filter(Boolean));
    return Array.from(memberSet).sort();
  }, [recommendations]);

  // Get unique list of types
  const types = useMemo(() => {
    const typeSet = new Set(recommendations.map((rec) => rec.type));
    return Array.from(typeSet);
  }, [recommendations]);

  // Filter recommendations based on selected member and type
  const filteredRecommendations = useMemo(() => {
    return recommendations.filter((rec) => {
      const matchesMember = !selectedMember || rec.recommendedBy === selectedMember;
      const matchesType = !selectedType || rec.type === selectedType;
      return matchesMember && matchesType;
    });
  }, [recommendations, selectedMember, selectedType]);

  return (
    <div>
      <div className="page-header">
        <h1>Recommendations</h1>
        <p>
          Discover your next favorite read, watch, or listen! Members share their
          top picks across books, TV shows, movies, and more.
        </p>
      </div>

      <RecommendationForm />

      <div className="recommendations-list-section">
        <h2>Member Picks</h2>

        {!loading && recommendations.length > 0 && (
          <div className="filter-container">
            <label className="filter-label">Filter by:</label>

            <select
              className="filter-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">All Types</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {typeLabels[type] || type}
                </option>
              ))}
            </select>

            <select
              className="filter-select"
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
            >
              <option value="">All Members</option>
              {members.map((member) => (
                <option key={member} value={member}>
                  {member}
                </option>
              ))}
            </select>
          </div>
        )}

        {loading ? (
          <div className="empty-state">
            <div className="empty-state-icon">&#128214;</div>
            <p>Loading recommendations...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <div className="empty-state-icon">&#128533;</div>
            <p>{error}</p>
          </div>
        ) : filteredRecommendations.length > 0 ? (
          <div className="book-grid">
            {filteredRecommendations.map((item) => (
              <BookCard key={item.id} book={item} type="recommendation" />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">&#128270;</div>
            <p>No recommendations yet. Be the first to add one!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Recommendations;
