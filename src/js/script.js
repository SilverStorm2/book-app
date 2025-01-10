class BooksList {
  constructor() {
    this.data = dataSource.books;
    this.filters = [];
    this.templateBook = Handlebars.compile(
      document.querySelector('#template-book').innerHTML
    );
    this.getElements();
    this.render();
    this.initAction();  
  }
    
  getElements() {
    this.booksList = document.querySelector('.books-list');
    this.filtersForm = document.querySelector('.filters');
  }
    
  render(){
    this.booksList.innerHTML = '';
    
    for (const book of this.data) {
      const ratingWidth = book.rating * 10;
      const ratingBgc = this.determineRatingBgc(book.rating);
    
      const bookData = {
        id: book.id,
        name: book.name,
        price: book.price,
        rating: book.rsting,
        image: book.image,
        details: book.details,
        ratingWidth,
        ratingBgc, 
      };
      const generatedHTML = this.templateBook(bookData);
      const bookElement = utils.createDOMFromHTML(generatedHTML);
      this.booksList.appendChild(bookElement);
    }
    this.filterBooks();
  }
    
  filterBooks() {
    for (const book of this.data) {
      let shouldBeHidden = false;
      
      for (const filter of this.filters) {
        if (!book.details[filter]) {
          shouldBeHidden = true;
          break;
        }
      }
      
      const bookElement = document.querySelector(
        `.book__image[data-id="${book.id}"]`
      );
      
      if (bookElement) {
        if (shouldBeHidden) {
          bookElement.classList.add('hidden');
        } else {
          bookElement.classList.remove('hidden');
        }
      }
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
    this.filtersForm.addEventListener('click', (event) => {
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
        console.log('Current Filters:', this.filters);
        this.filterBooks();
      }
    });
  }
    
}
new BooksList();