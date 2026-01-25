import { useState, useMemo } from 'react';
import BookCard from '../components/BookCard';
import pastBooks from '../data/pastBooks.json';

function PastBooks() {
  const [searchQuery, setSearchQuery] = useState('');

  // Sort books by most recently read and filter by search
  const filteredBooks = useMemo(() => {
    const sorted = [...pastBooks].sort((a, b) => {
      const dateA = new Date(a.dateRead);
      const dateB = new Date(b.dateRead);
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
