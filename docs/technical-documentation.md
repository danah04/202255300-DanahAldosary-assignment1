## Advanced Functionality (Assignment 3)

### 1. API Integration – “Did You Know?”
The application integrates an external API to fetch random facts:
- API: https://uselessfacts.jsph.pl
- Data is retrieved using the Fetch API
- Facts are displayed dynamically in the DOM
- Error handling displays a fallback message if the API fails

Optional state enhancement:
- The last fetched fact is stored using `localStorage` to improve user experience

---

### 2. Complex Logic – Project Filtering & Sorting

The Projects section includes multi-step logic:
- Filtering by category (e.g., academic, web)
- Filtering by difficulty level (beginner, advanced)
- Sorting by year (newest or oldest)

Implementation details:
- Uses `data-*` attributes (`data-category`, `data-year`, `data-level`)
- Applies multiple conditions simultaneously
- Dynamically updates the DOM based on user input
- Displays conditional messages depending on selected level

---

### 3. State Management – Dark Mode

Dark mode is implemented using `localStorage`:
- Users can toggle between light and dark themes
- The selected theme is saved in `localStorage`
- The theme persists after page reload

Implementation:
- `classList.toggle()` is used to apply the theme
- `localStorage.setItem()` stores the theme
- `localStorage.getItem()` restores it on load

---

### 4. Enhanced Form Validation

The contact form includes additional validation rules:
- Required field checks
- Email format validation
- Minimum message length validation
- Dynamic error messages

This ensures more robust user input handling.