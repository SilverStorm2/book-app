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
  
}