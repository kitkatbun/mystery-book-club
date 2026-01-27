function BookCard({ book, type = 'past' }) {
  const typeLabels = {
    book: 'Book',
    tv: 'TV Show',
    movie: 'Movie',
    other: 'Other'
  };

  const typeEmojis = {
    book: '📖',
    tv: '📺',
    movie: '🎬',
    other: '✨'
  };

  const placeholderEmoji = book.type ? typeEmojis[book.type] : '📖';

  return (
    <div className="book-card">
      <div className="book-card-cover">
        {book.coverImage ? (
          <img src={book.coverImage} alt={`Cover of ${book.title}`} />
        ) : (
          <span className="book-card-placeholder">{placeholderEmoji}</span>
        )}
        {book.type && type === 'recommendation' && (
          <span className={`type-badge type-${book.type}`}>
            {book.type === 'other' && book.customType ? book.customType : typeLabels[book.type]}
          </span>
        )}
      </div>
      <div className="book-card-content">
        <h3 className="book-card-title">{book.title}</h3>
        {book.author && <p className="book-card-author">by {book.author}</p>}
        {book.platform && <p className="book-card-platform">{book.platform}</p>}

        {type === 'past' && (
          <>
            <p className="book-card-recommended-by">
              Recommended by {book.recommendedBy}
            </p>
            <div className="book-card-meta">
              <span className="book-card-date">{book.dateRead}</span>
            </div>
          </>
        )}

        {type === 'recommendation' && (
          <>
            <p className="book-card-recommended-by">
              Recommended by {book.recommendedBy}
            </p>
            {book.reason && (
              <p className="book-card-reason">"{book.reason}"</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default BookCard;
