# Adding Books to Mystery Book Club

A quick reference guide for adding new books to the Mystery Book Club list using the interactive terminal script.

## Quick Start

From the `book-club` directory, run:

```bash
npm run add-book
```

Or if you prefer running Node directly:

```bash
node scripts/add-book.cjs
```

## Step-by-Step Guide

### 1. **Start the Script**
Open your terminal, navigate to the book-club folder, and run the command above. You'll see:
```
📚 Add a New Book to Mystery Book Club

Enter the book details (press Enter to skip optional fields):
```

### 2. **Enter Title** (Required)
```
Title (required): The Murder of Roger Ackroyd
```
- This field is required—the script will exit if you leave it blank
- Enter the exact book title

### 3. **Enter Author** (Required)
```
Author (required): Agatha Christie
```
- This field is required—the script will exit if you leave it blank
- Enter the author's name

### 4. **Enter Date Read** (Optional)
```
Date Read [April 2026]: March 2026
```
- The script suggests today's month and year in brackets
- Press Enter to use the default, or type a custom date
- Format: Any readable date format (e.g., "March 2026", "March 15, 2026", "3/15/2026")

### 5. **Enter ISBN** (Optional)
```
ISBN (for cover image lookup): 9780062073556
```
- ISBN is optional but highly recommended—it helps find cover images automatically
- Find ISBNs on Amazon, Goodreads, or your library catalog
- If you provide an ISBN, the script will automatically look up a cover image

### 6. **Cover Image** (Optional)
If you provided an ISBN:
```
  Looking up cover image...
  ✓ Found cover image
```
The script found a cover automatically! If it didn't find one, it will ask:
```
Cover Image URL (optional): https://example.com/cover.jpg
```
You can paste a direct URL to a cover image, or leave it blank.

If you didn't provide an ISBN:
```
Cover Image URL (optional): https://example.com/cover.jpg
```
You can provide a cover image URL, or skip it.

### 7. **Recommended By** (Optional)
```
Recommended By: Sarah
```
- Enter the name of who recommended the book, or leave blank

### 8. **Genre** (Optional)
```
Genre: Mystery
```
- Enter the genre (Mystery, Romance, Science Fiction, etc.), or leave blank

### 9. **Publication Date** (Optional)
```
Publication Date/Year: 1926
```
- Enter the year the book was published, or leave blank
- Can be just a year (1926) or a full date (October 1926)

### 10. **Review Your Entry**
The script shows a preview:
```
📖 New Book Entry:

{
  "id": 47,
  "title": "The Murder of Roger Ackroyd",
  "author": "Agatha Christie",
  "dateRead": "March 2026",
  "coverImage": "https://covers.openlibrary.org/b/isbn/9780062073556-M.jpg",
  "isbn": "9780062073556",
  "recommendedBy": "Sarah",
  "genre": "Mystery",
  "publicationDate": "1926"
}
```

Review it carefully!

### 11. **Confirm Addition**
```
Add this book? (Y/n): Y
```
- Press Enter or type `Y` to add the book
- Type `n` to cancel (no changes made)

### 12. **Push to GitHub** (Optional)
```
Push to GitHub? (y/N): y
```
- Type `y` to commit and push the changes to GitHub
- Type `n` (or just press Enter) to save locally without pushing
- The script will run `git add`, `git commit`, and `git push` for you
- If you skip this, you can push manually later with `git push`

## Success! ✅

The book is now added to the club's list and will appear on the website!

## Troubleshooting

### "Title is required" / "Author is required"
These two fields are mandatory. Go back and provide both before the script will continue.

### ISBN Not Found / No Cover Image
This can happen if:
- The ISBN is incorrect
- The book is very old or obscure
- The Open Library API is temporarily unavailable

**Solution:** You can add a cover image URL manually when prompted, or leave it blank and add one later by editing `src/data/pastBooks.json`.

### Git Push Failed
This means the script couldn't connect to GitHub or you don't have permission to push.

**Solution:** The book is still saved locally in `pastBooks.json`. You can:
1. Check your internet connection
2. Make sure you've authenticated with GitHub (`git status` to test)
3. Push manually later with `git push`

### Need to Edit a Book Later?
You can manually edit `src/data/pastBooks.json` in your text editor, or delete the entry and re-run the script.

## Tips

- **Best Practice:** Always include the ISBN if you can find it—it makes cover lookup automatic
- **Date Format:** The script is flexible with date formats, so "March 2026", "3/2026", or "March 15, 2026" all work
- **Optional Fields:** Skip any field by pressing Enter without typing anything
- **Publication Year vs. Date Read:** "Publication Date" is when the book was published; "Date Read" is when your club discussed it
- **GitHub Sync:** If you push to GitHub, the website updates automatically (usually within a few minutes)

---

Happy reading! 📚
