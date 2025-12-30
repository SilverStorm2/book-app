class BooksList {
  constructor() {
    this.data = dataSource.books;
    this.filters = [];
    this.searchQuery = '';
    this.sortBy = 'default';
    this.sortDir = 'asc';
    this.favorites = [];
    this.storageKey = 'booksListState';
    this.templateBook = Handlebars.compile(
      document.querySelector('#template-book').innerHTML
    );
    this.getElements();
    this.loadState();
    this.render();
    this.initActions();  
  }
    
  getElements() {
    this.booksList = document.querySelector('.books-list');
    this.filtersForm = document.querySelector('.filters');
    this.favoritesList = document.querySelector('.favorites-list');
    this.favoritesEmpty = document.querySelector('[data-favorites-empty]');
    this.clearFavoritesButton = document.querySelector('[data-clear-favorites]');
    this.searchInput = this.filtersForm.querySelector('[data-search]');
    this.sortBySelect = this.filtersForm.querySelector('[data-sort-by]');
    this.sortDirSelect = this.filtersForm.querySelector('[data-sort-dir]');
  }

  loadState() {
    const savedState = localStorage.getItem(this.storageKey);

    if (!savedState) {
      return;
    }

    try {
      const parsedState = JSON.parse(savedState);

      if (Array.isArray(parsedState.filters)) {
        this.filters = parsedState.filters;
      }
      if (typeof parsedState.searchQuery === 'string') {
        this.searchQuery = parsedState.searchQuery;
      }
      if (parsedState.sortBy) {
        this.sortBy = parsedState.sortBy;
      }
      if (parsedState.sortDir) {
        this.sortDir = parsedState.sortDir;
      }
      if (Array.isArray(parsedState.favorites)) {
        this.favorites = parsedState.favorites;
      }
    } catch (error) {
      console.warn('Failed to parse saved state.', error);
      return;
    }

    const filterInputs = this.filtersForm.querySelectorAll(
      'input[name="filter"]'
    );

    for (const input of filterInputs) {
      input.checked = this.filters.includes(input.value);
    }

    if (this.searchInput) {
      this.searchInput.value = this.searchQuery;
    }
    if (this.sortBySelect) {
      this.sortBySelect.value = this.sortBy;
    }
    if (this.sortDirSelect) {
      this.sortDirSelect.value = this.sortDir;
    }
  }

  saveState() {
    const state = {
      filters: this.filters,
      searchQuery: this.searchQuery,
      sortBy: this.sortBy,
      sortDir: this.sortDir,
      favorites: this.favorites,
    };

    localStorage.setItem(this.storageKey, JSON.stringify(state));
  }

  getVisibleBooks() {
    const query = this.searchQuery.trim().toLowerCase();
    let books = this.data.filter((book) => {
      if (query && !book.name.toLowerCase().includes(query)) {
        return false;
      }

      for (const filter of this.filters) {
        if (!book.details[filter]) {
          return false;
        }
      }

      return true;
    });

    if (this.sortBy !== 'default') {
      const sortDir = this.sortDir === 'desc' ? -1 : 1;

      books = books.slice().sort((a, b) => {
        if (this.sortBy === 'name') {
          return (
            a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }) *
            sortDir
          );
        }
        if (this.sortBy === 'price') {
          return (a.price - b.price) * sortDir;
        }
        if (this.sortBy === 'rating') {
          return (a.rating - b.rating) * sortDir;
        }
        return 0;
      });
    }

    if (this.favorites.length) {
      books = books.slice().sort((a, b) => {
        const aFavorite = this.favorites.includes(a.id);
        const bFavorite = this.favorites.includes(b.id);

        if (aFavorite === bFavorite) {
          return 0;
        }

        return aFavorite ? -1 : 1;
      });
    }

    return books;
  }
    
  render() {
    this.booksList.innerHTML = '';

    const visibleBooks = this.getVisibleBooks();

    for (const book of visibleBooks) {
      const ratingWidth = book.rating * 10;
      const ratingBgc = this.determineRatingBgc(book.rating);
    
      const bookData = {
        id: book.id,
        name: book.name,
        price: book.price,
        rating: book.rating,
        image: book.image,
        details: book.details,
        ratingWidth,
        ratingBgc,
        isFavorite: this.favorites.includes(book.id),
      };
      const generatedHTML = this.templateBook(bookData);
      const bookElement = utils.createDOMFromHTML(generatedHTML);
      this.booksList.appendChild(bookElement);
    }

    this.renderFavorites();
  }

  renderFavorites() {
    if (!this.favoritesList) {
      return;
    }

    this.favoritesList.innerHTML = '';

    const favoritesBooks = this.data.filter((book) =>
      this.favorites.includes(book.id)
    );

    for (const book of favoritesBooks) {
      const ratingWidth = book.rating * 10;
      const ratingBgc = this.determineRatingBgc(book.rating);

      const bookData = {
        id: book.id,
        name: book.name,
        price: book.price,
        rating: book.rating,
        image: book.image,
        details: book.details,
        ratingWidth,
        ratingBgc,
        isFavorite: true,
      };

      const generatedHTML = this.templateBook(bookData);
      const bookElement = utils.createDOMFromHTML(generatedHTML);
      this.favoritesList.appendChild(bookElement);
    }

    if (this.favoritesEmpty) {
      this.favoritesEmpty.style.display = favoritesBooks.length ? 'none' : 'block';
    }
  }

  determineRatingBgc(rating) {
    if (rating < 6) {
      return 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)';
    } else if (rating > 6 && rating <= 8) {
      return 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
    } else if (rating > 8 && rating <= 9) {
      return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
    } else if (rating > 9) {
      return 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
    }
  }

  initActions() {
    this.booksList.addEventListener('click', (event) => {
      const bookImage = event.target.closest('.book__image');

      if (!bookImage) {
        return;
      }

      event.preventDefault();

      const bookId = parseInt(bookImage.getAttribute('data-id'), 10);

      if (Number.isNaN(bookId)) {
        return;
      }

      if (this.favorites.includes(bookId)) {
        this.favorites = this.favorites.filter((id) => id !== bookId);
      } else {
        this.favorites.push(bookId);
      }

      this.saveState();
      this.render();
    });

    if (this.favoritesList) {
      this.favoritesList.addEventListener('click', (event) => {
        const bookImage = event.target.closest('.book__image');

        if (!bookImage) {
          return;
        }

        event.preventDefault();

        const bookId = parseInt(bookImage.getAttribute('data-id'), 10);

        if (Number.isNaN(bookId)) {
          return;
        }

        this.favorites = this.favorites.filter((id) => id !== bookId);
        this.saveState();
        this.render();
      });
    }

    if (this.clearFavoritesButton) {
      this.clearFavoritesButton.addEventListener('click', () => {
        this.favorites = [];
        this.saveState();
        this.render();
      });
    }

    this.filtersForm.addEventListener('change', (event) => {
      if (
        event.target.tagName === 'INPUT' &&
        event.target.type === 'checkbox' &&
        event.target.name === 'filter'
      ) {
        const filterValue = event.target.value;

        if (event.target.checked && !this.filters.includes(filterValue)) {
          this.filters.push(filterValue);
        } else if (
          !event.target.checked &&
          this.filters.includes(filterValue)
        ) {
          const index = this.filters.indexOf(filterValue);
          this.filters.splice(index, 1);
        }
        this.saveState();
        this.render();
      }

      if (event.target === this.sortBySelect) {
        this.sortBy = event.target.value;
        this.saveState();
        this.render();
      }

      if (event.target === this.sortDirSelect) {
        this.sortDir = event.target.value;
        this.saveState();
        this.render();
      }
    });

    if (this.searchInput) {
      this.searchInput.addEventListener('input', (event) => {
        this.searchQuery = event.target.value;
        this.saveState();
        this.render();
      });
    }
  }
    
}
new BooksList();
