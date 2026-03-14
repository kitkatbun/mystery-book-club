import { useState, useMemo } from 'react';
import BookCard from '../components/BookCard';
import pastBooks from '../data/pastBooks.json';

// Parse "Month Year" format to sortable date
function parseMonthYear(dateStr) {
  if (!dateStr) return new Date(0);

  const months = {
    'january': 0, 'february': 1, 'march': 2, 'april': 3,
    'may': 4, 'june': 5, 'july': 6, 'august': 7,
    'september': 8, 'october': 9, 'november': 10, 'december': 11
  };

  const parts = dateStr.toLowerCase().trim().split(/\s+/);
  if (parts.length >= 2) {
    const month = months[parts[0]];
    const year = parseInt(parts[1]);
    if (month !== undefined && !isNaN(year)) {
      return new Date(year, month, 1);
    }
  }

  return new Date(0); // Fallback for unparseable dates
}

function PastBooks() {
  const [searchQuery, setSearchQuery] = useState('');

  // Sort books by most recently read and filter by search
  const filteredBooks = useMemo(() => {
    const sorted = [...pastBooks].sort((a, b) => {
      const dateA = parseMonthYear(a.dateRead);
      const dateB = parseMonthYear(b.dateRead);
      return dateB - dateA;
    });

    if (!searchQuery.trim()) {
      return sorted;
    }

    const query = searchQuery.toLowerCase().trim();
    return sorted.filter((book) =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      (book.isbn && book.isbn.includes(query))
    );
  }, [searchQuery]);

  return (
    <div>
      <div className="page-header">
        <h1>Past Books</h1>
        <p>
          A collection of all the cozy mysteries we've read and discussed together.
        </p>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by title, author, or ISBN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredBooks.length > 0 ? (
        <div className="book-grid">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} type="past" />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">&#128270;</div>
          <p>No books found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}

export default PastBooks;
