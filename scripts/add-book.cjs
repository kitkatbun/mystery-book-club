#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const PAST_BOOKS_PATH = path.join(__dirname, '../src/data/pastBooks.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function fetchCoverImage(isbn) {
  if (!isbn) return '';

  // Try Open Library first
  const openLibraryUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;

  try {
    const response = await fetch(openLibraryUrl, { method: 'HEAD' });
    if (response.ok && response.headers.get('content-length') > 1000) {
      return openLibraryUrl;
    }
  } catch (e) {
    // Fall through to return empty
  }

  return '';
}

async function main() {
  console.log('\n📚 Add a New Book to Mystery Book Club\n');
  console.log('Enter the book details (press Enter to skip optional fields):\n');

  // Read existing books
  const booksData = fs.readFileSync(PAST_BOOKS_PATH, 'utf8');
  const books = JSON.parse(booksData);

  // Get the next ID
  const nextId = Math.max(...books.map(b => b.id)) + 1;

  // Gather book information
  const title = await question('Title (required): ');
  if (!title) {
    console.log('❌ Title is required. Exiting.');
    rl.close();
    return;
  }

  const author = await question('Author (required): ');
  if (!author) {
    console.log('❌ Author is required. Exiting.');
    rl.close();
    return;
  }

  // Default to current month/year
  const now = new Date();
  const defaultDate = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const dateRead = await question(`Date Read [${defaultDate}]: `) || defaultDate;

  const isbn = await question('ISBN (for cover image lookup): ');

  let coverImage = '';
  if (isbn) {
    console.log('  Looking up cover image...');
    coverImage = await fetchCoverImage(isbn);
    if (coverImage) {
      console.log('  ✓ Found cover image');
    } else {
      console.log('  ✗ No cover found, you can add manually later');
      coverImage = await question('Cover Image URL (optional): ');
    }
  } else {
    coverImage = await question('Cover Image URL (optional): ');
  }

  const recommendedBy = await question('Recommended By: ');
  const genre = await question('Genre: ');
  const publicationDate = await question('Publication Date/Year: ');

  // Create the new book object
  const newBook = {
    id: nextId,
    title,
    author,
    dateRead,
    coverImage,
    isbn: isbn || '',
    recommendedBy,
    genre,
    publicationDate: publicationDate ? (isNaN(publicationDate) ? publicationDate : parseInt(publicationDate)) : ''
  };

  // Show preview
  console.log('\n📖 New Book Entry:\n');
  console.log(JSON.stringify(newBook, null, 2));

  const confirm = await question('\nAdd this book? (Y/n): ');

  if (confirm.toLowerCase() === 'n') {
    console.log('❌ Cancelled. No changes made.');
    rl.close();
    return;
  }

  // Add to beginning of array (most recent first)
  books.unshift(newBook);

  // Write back to file
  fs.writeFileSync(PAST_BOOKS_PATH, JSON.stringify(books, null, 2) + '\n');

  console.log(`\n✅ Added "${title}" by ${author} to the book club list!`);
  console.log(`   Total books: ${books.length}`);

  // Ask about pushing to GitHub
  const pushConfirm = await question('\nPush to GitHub? (y/N): ');

  if (pushConfirm.toLowerCase() === 'y') {
    const { execSync } = require('child_process');
    const projectDir = path.join(__dirname, '..');

    try {
      console.log('\n📤 Pushing to GitHub...');

      // Git add, commit, and push
      execSync('git add src/data/pastBooks.json', { cwd: projectDir, stdio: 'inherit' });
      execSync(`git commit -m "Add ${dateRead} book: ${title}"`, { cwd: projectDir, stdio: 'inherit' });
      execSync('git push', { cwd: projectDir, stdio: 'inherit' });

      console.log('\n✅ Pushed to GitHub! Site will update shortly.');
    } catch (err) {
      console.log('\n❌ Git push failed. You can push manually later.');
      console.log('   Run: git add . && git commit -m "Add book" && git push');
    }
  } else {
    console.log('\n📝 Changes saved locally. Run "git push" when ready.');
  }

  rl.close();
}

main().catch((err) => {
  console.error('Error:', err);
  rl.close();
  process.exit(1);
});
