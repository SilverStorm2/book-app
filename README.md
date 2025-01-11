# BooksList Application

## Overview
BooksList is a JavaScript application designed to display and filter a list of books dynamically. Users can filter books by specific criteria using checkboxes and view book ratings with visually appealing background gradients.

---

## Features
- **Dynamic Book Rendering:** Display books dynamically based on a Handlebars template.
- **Filtering System:** Show or hide books based on user-selected criteria.
- **Rating Visualization:** Represent book ratings with colorful gradient backgrounds.
- **Real-time Updates:** Instantly update the book list when filters are applied.

---

## Technologies Used
- **JavaScript:** For dynamic behavior and filtering logic.
- **Handlebars:** For rendering book data as HTML templates.
- **HTML/CSS:** For the user interface and styling.

---

## How It Works

### Initialization
- The application fetches book data from a `dataSource.books` object.
- Filters are initialized as an empty array.
- Handlebars compiles the book template.

### Rendering Books
- The `render()` method generates book elements dynamically and appends them to the DOM.
- Each book includes details like name, price, rating, and a gradient background based on the rating.

### Filtering Books
- Users can select checkboxes to apply filters.
- Books that do not meet the selected criteria are hidden.

### Event Handling
- Checkboxes are connected to event listeners that update the filters and re-render the visible books.

---

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/bookslist.git
