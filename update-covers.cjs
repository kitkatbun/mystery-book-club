const fs = require('fs');
const path = require('path');

const pastBooksPath = path.join(__dirname, 'src', 'data', 'pastBooks.json');
const pastBooks = JSON.parse(fs.readFileSync(pastBooksPath, 'utf8'));

async function fetchCover(isbn) {
  try {
    const response = await fetch(`https://bookcover.longitood.com/bookcover/${isbn}`);
    if (response.ok) {
      const data = await response.json();
      return data.url || null;
    }
  } catch (err) {
    // ignore errors
  }
  return null;
}

async function updateCovers() {
  let updated = 0;
  let failed = 0;

  for (const book of pastBooks) {
    if (book.isbn) {
      process.stdout.write(`Fetching cover for "${book.title}"... `);
      const coverUrl = await fetchCover(book.isbn);
      if (coverUrl) {
        book.coverImage = coverUrl;
        updated++;
        console.log('✓');
      } else {
        failed++;
        console.log('✗ (no cover found)');
      }
      // Small delay to be nice to the API
      await new Promise(r => setTimeout(r, 100));
    }
  }

  fs.writeFileSync(pastBooksPath, JSON.stringify(pastBooks, null, 2));
  console.log(`\nDone! Updated ${updated} covers, ${failed} failed.`);
}

updateCovers();
