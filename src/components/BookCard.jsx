function BookCard({ book, type = 'past' }) {
  return (
    <div className="book-card">
      <div className="book-card-cover">
        {book.coverImage ? (
          <img src={book.coverImage} alt={`Cover of ${book.title}`} />
        ) : (
          <span className="book-card-placeholder">&#128214;</span>
        )}
      </div>
      <div className="book-card-content">
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-author">by {book.author}</p>

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
