import { useMemo } from 'react';
import pastBooks from '../data/pastBooks.json';

// Parse "Month Year" format to sortable date
function parseMonthYear(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;

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

function NextUp() {
  const parseDate = parseMonthYear;

  // Analyze pick history to determine rotation
  const pickData = useMemo(() => {
    // Get all books with valid dates and recommenders
    const booksWithPickers = pastBooks
      .filter(book => book.recommendedBy && book.dateRead)
      .map(book => ({
        ...book,
        date: parseDate(book.dateRead)
      }))
      .filter(book => book.date !== null)
      .sort((a, b) => b.date - a.date);

    // Get recent picks (last 12 months of picks)
    const recentPicks = booksWithPickers.slice(0, 12);

    // Helper to check if a picker name should be excluded
    const shouldExclude = (name) => {
      const lower = name.toLowerCase().trim();
      // Check for exact matches or specific patterns (not substrings like "all" in "Allie")
      const excludePatterns = ['group', 'backlist', 'local', 'survey', 'general'];
      const exactExcludes = ['all'];

      if (exactExcludes.includes(lower)) return true;
      return excludePatterns.some(pattern => lower.includes(pattern));
    };

    // Helper to split combined pickers like "Jessie/Jessica" or "Jacki/Jessica"
    const splitPickers = (pickerStr) => {
      if (!pickerStr) return [];
      return pickerStr.split('/').map(p => p.trim()).filter(p => p && !shouldExclude(p));
    };

    // Count picks per member (all time)
    const pickCounts = {};
    booksWithPickers.forEach(book => {
      const pickers = splitPickers(book.recommendedBy);
      pickers.forEach(picker => {
        pickCounts[picker] = (pickCounts[picker] || 0) + 1;
      });
    });

    // Get unique active members (picked in last 2 years)
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

    const activeMembers = new Set();
    booksWithPickers
      .filter(book => book.date >= twoYearsAgo)
      .forEach(book => {
        const pickers = splitPickers(book.recommendedBy);
        pickers.forEach(picker => {
          activeMembers.add(picker);
        });
      });

    // Find last pick date for each active member
    const lastPickDates = {};
    booksWithPickers.forEach(book => {
      const pickers = splitPickers(book.recommendedBy);
      pickers.forEach(picker => {
        if (activeMembers.has(picker) && !lastPickDates[picker]) {
          lastPickDates[picker] = book;
        }
      });
    });

    // Sort members by who picked longest ago (they should be next)
    const sortedMembers = Array.from(activeMembers)
      .map(member => ({
        name: member,
        lastPick: lastPickDates[member],
        totalPicks: pickCounts[member] || 0
      }))
      .sort((a, b) => {
        // Sort by last pick date (oldest first = should pick next)
        const dateA = a.lastPick ? a.lastPick.date : new Date(0);
        const dateB = b.lastPick ? b.lastPick.date : new Date(0);
        return dateA - dateB;
      });

    return {
      recentPicks,
      sortedMembers,
      totalBooks: booksWithPickers.length
    };
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Next Up</h1>
        <p>
          See who's next in the pick rotation based on when members last chose a book.
        </p>
      </div>

      <div className="nextup-container">
        <section className="nextup-section">
          <h2>Pick Queue</h2>
          <p className="section-subtitle">Members sorted by who should pick next (longest wait first)</p>

          <div className="pick-queue">
            {pickData.sortedMembers.length > 0 ? (
              pickData.sortedMembers.map((member, index) => (
                <div
                  key={member.name}
                  className={`queue-card ${index === 0 ? 'next-picker' : ''}`}
                >
                  <div className="queue-position">
                    {index === 0 ? 'Next' : `#${index + 1}`}
                  </div>
                  <div className="queue-info">
                    <h3 className="queue-name">{member.name}</h3>
                    <p className="queue-last-pick">
                      Last pick: {member.lastPick ? (
                        <>
                          <em>{member.lastPick.title}</em>
                          <span className="pick-date"> ({member.lastPick.dateRead})</span>
                        </>
                      ) : 'Never'}
                    </p>
                    <p className="queue-total">Total picks: {member.totalPicks}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-message">No pick data available</p>
            )}
          </div>
        </section>

        <section className="nextup-section">
          <h2>Recent Picks</h2>
          <p className="section-subtitle">The last 12 books and who picked them</p>

          <div className="recent-picks-list">
            {pickData.recentPicks.length > 0 ? (
              pickData.recentPicks.map((book) => (
                <div key={book.id} className="recent-pick-item">
                  <span className="recent-pick-date">{book.dateRead}</span>
                  <span className="recent-pick-title">{book.title}</span>
                  <span className="recent-pick-by">{book.recommendedBy}</span>
                </div>
              ))
            ) : (
              <p className="empty-message">No recent picks available</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default NextUp;
