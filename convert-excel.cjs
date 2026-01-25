const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
const workbook = XLSX.readFile('./MysteryBookList (2).xlsx');
const sheet = workbook.Sheets['Sheet1'];
const data = XLSX.utils.sheet_to_json(sheet);

// Convert Excel date number to readable format
function excelDateToString(excelDate) {
  if (!excelDate || typeof excelDate !== 'number') {
    return excelDate || '';
  }
  const date = new Date((excelDate - 25569) * 86400 * 1000);
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Titles to skip (not actual books)
const skipTitles = [
  'skip', 'no meeting', 'who picked', 'who picks', 'summer break',
  'abandoned', 'holiday dinner', 'mystery dinner', 'everyone brings',
  'dramatic reading', 'postponed', 'games?', 'deception murder mystery game',
  'redux', 'we\'ll skip', 'draft of most recent'
];

// Search Google Books API for book info
async function lookupBook(title, author) {
  try {
    // Clean up title for search
    let cleanTitle = title.split(':')[0].split('(')[0].trim();
    cleanTitle = cleanTitle.replace(/[#?]/g, '').replace(/\s+/g, ' ').trim();

    // Clean up author - take first/last name only
    let cleanAuthor = author.split(',')[0].trim();

    // Search with both title and author for better accuracy
    const query = encodeURIComponent(`intitle:${cleanTitle} inauthor:${cleanAuthor}`);
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=3`;

    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();
    if (data.items && data.items.length > 0) {
      for (const item of data.items) {
        const volumeInfo = item.volumeInfo;

        // Get ISBN-13 or ISBN-10
        let isbn = null;
        if (volumeInfo.industryIdentifiers) {
          const isbn13 = volumeInfo.industryIdentifiers.find(id => id.type === 'ISBN_13');
          const isbn10 = volumeInfo.industryIdentifiers.find(id => id.type === 'ISBN_10');
          isbn = isbn13 ? isbn13.identifier : (isbn10 ? isbn10.identifier : null);
        }

        // Get author name
        const authorName = volumeInfo.authors ? volumeInfo.authors[0] : null;

        if (isbn) {
          return { isbn, authorName };
        }
      }

      // Return author name even if no ISBN
      const firstItem = data.items[0].volumeInfo;
      return {
        isbn: null,
        authorName: firstItem.authors ? firstItem.authors[0] : null
      };
    }
  } catch (error) {
    // Silently fail
  }
  return null;
}

// Delay helper for rate limiting
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  // Convert to pastBooks format
  let pastBooks = data
    .map((row, index) => {
      const title = (row['Title'] || '').trim();
      const lastName = (row['Author'] || '').trim();
      const firstName = (row['__EMPTY_1'] || '').trim();

      // Combine first and last name properly
      let author = firstName ? `${firstName} ${lastName}` : lastName;
      // Clean up extra spaces
      author = author.replace(/\s+/g, ' ').trim();

      return {
        id: index + 1,
        title: title,
        author: author,
        dateRead: excelDateToString(row['Date Discussed']),
        coverImage: '',
        isbn: '',
        recommendedBy: (row['Who Picked?'] || '').trim(),
        genre: (row['Type '] || '').trim(),
        publicationDate: row['Publication Date'] || ''
      };
    })
    // Filter out non-book entries
    .filter(book => {
      if (!book.title || !book.author) return false;
      const titleLower = book.title.toLowerCase();
      for (const skip of skipTitles) {
        if (titleLower.includes(skip)) return false;
      }
      if (book.author.toLowerCase().includes('skip')) return false;
      if (book.author.toLowerCase().includes('no book')) return false;
      return true;
    });

  // Sort by date (most recent first)
  pastBooks.sort((a, b) => {
    const dateA = new Date(a.dateRead);
    const dateB = new Date(b.dateRead);
    if (isNaN(dateA) && isNaN(dateB)) return 0;
    if (isNaN(dateA)) return 1;
    if (isNaN(dateB)) return -1;
    return dateB - dateA;
  });

  // Reassign IDs after filtering
  pastBooks.forEach((book, index) => {
    book.id = index + 1;
  });

  console.log(`Processing ${pastBooks.length} books...`);
  console.log('Looking up ISBNs from Google Books API...\n');

  // Look up each book
  let foundCount = 0;
  let fixedAuthors = 0;

  for (let i = 0; i < pastBooks.length; i++) {
    const book = pastBooks[i];
    const shortTitle = book.title.length > 35 ? book.title.substring(0, 35) + '...' : book.title;
    process.stdout.write(`\r[${i + 1}/${pastBooks.length}] ${shortTitle.padEnd(40)}`);

    const result = await lookupBook(book.title, book.author);

    if (result) {
      if (result.isbn) {
        book.isbn = result.isbn;
        book.coverImage = `https://covers.openlibrary.org/b/isbn/${result.isbn}-M.jpg`;
        foundCount++;
      }

      // Update author name if it looks correct (similar to original)
      if (result.authorName) {
        const origLower = book.author.toLowerCase();
        const newLower = result.authorName.toLowerCase();
        // Only update if it contains part of the original name (to avoid wrong matches)
        const origParts = origLower.split(' ');
        const matchesOriginal = origParts.some(part => part.length > 2 && newLower.includes(part));

        if (matchesOriginal && book.author !== result.authorName) {
          book.author = result.authorName;
          fixedAuthors++;
        }
      }
    }

    // Rate limiting - Google allows ~100 requests/100 seconds
    await delay(200);
  }

  console.log(`\n\nFound ISBNs for ${foundCount} of ${pastBooks.length} books`);
  console.log(`Fixed/updated ${fixedAuthors} author names`);

  // Write to JSON file
  fs.writeFileSync(
    './src/data/pastBooks.json',
    JSON.stringify(pastBooks, null, 2)
  );

  console.log(`\nSaved to src/data/pastBooks.json`);

  console.log('\nSample entries with ISBNs:');
  pastBooks.filter(b => b.isbn).slice(0, 15).forEach(book => {
    console.log(`- "${book.title.substring(0, 40)}" by ${book.author} - ISBN: ${book.isbn}`);
  });

  const missingIsbn = pastBooks.filter(b => !b.isbn);
  if (missingIsbn.length > 0 && missingIsbn.length < 20) {
    console.log(`\nBooks without ISBNs (${missingIsbn.length}):`);
    missingIsbn.forEach(book => {
      console.log(`- "${book.title}" by ${book.author}`);
    });
  } else if (missingIsbn.length >= 20) {
    console.log(`\n${missingIsbn.length} books without ISBNs (you may need to add these manually)`);
  }
}

main().catch(console.error);
