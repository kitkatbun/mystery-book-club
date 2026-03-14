import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import pastBooks from '../data/pastBooks.json';

// Parse "Month Year" format to date
function parseMonthYear(dateStr) {
  if (!dateStr) return null;

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
  return null;
}

function Home() {
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Get upcoming books (future dates)
  const upcomingBooks = useMemo(() => {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return pastBooks
      .filter(book => {
        const bookDate = parseMonthYear(book.dateRead);
        return bookDate && bookDate > currentMonth;
      })
      .sort((a, b) => {
        const dateA = parseMonthYear(a.dateRead);
        const dateB = parseMonthYear(b.dateRead);
        return dateA - dateB; // Soonest first
      });
  }, []);

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % upcomingBooks.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + upcomingBooks.length) % upcomingBooks.length);
  };

  return (
    <div className="home-container">
      <div className="home-welcome">
        <h1>Mystery Book Club</h1>
        <p className="subtitle">Where every page turns into an adventure</p>
        <p className="description">
          Welcome to our cozy corner of the literary world! We're a group of
          mystery enthusiasts who gather to discuss whodunits, cozies, and
          thrilling tales. Whether you prefer amateur sleuths, small-town
          mysteries, or classic detective stories, you've found your people.
        </p>
      </div>

      {upcomingBooks.length > 0 && (
        <>
          <div className="decorative-divider">&#128214;</div>

          <div className="upcoming-section">
            <h2>Coming Up</h2>
            <div className="upcoming-carousel">
              {upcomingBooks.length > 1 && (
                <button className="carousel-btn prev" onClick={prevSlide}>
                  &#8249;
                </button>
              )}

              <div className="upcoming-book-card">
                {upcomingBooks[carouselIndex].coverImage && (
                  <img
                    src={upcomingBooks[carouselIndex].coverImage}
                    alt={upcomingBooks[carouselIndex].title}
                    className="upcoming-cover"
                  />
                )}
                <div className="upcoming-info">
                  <span className="upcoming-date">{upcomingBooks[carouselIndex].dateRead}</span>
                  <h3 className="upcoming-title">{upcomingBooks[carouselIndex].title}</h3>
                  <p className="upcoming-author">by {upcomingBooks[carouselIndex].author}</p>
                  {upcomingBooks[carouselIndex].recommendedBy && (
                    <p className="upcoming-picker">
                      Picked by {upcomingBooks[carouselIndex].recommendedBy}
                    </p>
                  )}
                </div>
              </div>

              {upcomingBooks.length > 1 && (
                <button className="carousel-btn next" onClick={nextSlide}>
                  &#8250;
                </button>
              )}
            </div>

            {upcomingBooks.length > 1 && (
              <div className="carousel-dots">
                {upcomingBooks.map((_, index) => (
                  <button
                    key={index}
                    className={`carousel-dot ${index === carouselIndex ? 'active' : ''}`}
                    onClick={() => setCarouselIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <div className="decorative-divider">&#128270;</div>

      <div className="home-nav-cards">
        <Link to="/past-books" className="nav-card">
          <div className="nav-card-icon">&#128218;</div>
          <h2>Past Books</h2>
          <p>Explore all the mysteries we've solved together</p>
        </Link>

        <Link to="/recommendations" className="nav-card">
          <div className="nav-card-icon">&#128161;</div>
          <h2>Recommendations</h2>
          <p>Discover what our members are excited to read next</p>
        </Link>
      </div>
    </div>
  );
}

export default Home;
