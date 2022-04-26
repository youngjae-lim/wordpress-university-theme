import $ from 'jquery'

class Search {
  // 1. Initiate Search Object
  constructor() {
    this.openButton = $('.js-search-trigger')
    this.closeButton = $('.search-overlay__close')
    this.searchOverlay = $('.search-overlay')
    this.searchField = $('#search-term')
    this.resultsDiv = $('#search-overlay__results')
    this.events()
    this.isOverlayOpen = false
    this.isSpinnerVisible = false
    this.previousValue
    this.typingTimer
  }

  // 2. Events
  events() {
    this.openButton.on('click', this.openOverlay.bind(this))
    this.closeButton.on('click', this.closeOverlay.bind(this))
    $(document).on('keydown', this.keyPressDispatch.bind(this))
    this.searchField.on('keyup', this.typingLogic.bind(this))
  }

  // 3. Methods (functions, action...)
  openOverlay() {
    this.searchOverlay.addClass('search-overlay--active')
    $('body').addClass('body-no-scroll')
    this.isOverlayOpen = true
    setTimeout(() => this.searchField.trigger('focus'), 301)
  }

  closeOverlay() {
    this.searchOverlay.removeClass('search-overlay--active')
    $('body').removeClass('body-no-scroll')
    this.isOverlayOpen = false
  }

  keyPressDispatch(e) {
    // if s is pressed down and overlay is not open and any other input/textarea are not focused
    if (
      e.keyCode === 83 &&
      !this.isOverlayOpen &&
      !$('input, textarea').is(':focus')
    ) {
      this.openOverlay()
    }

    // if escape is pressed down and overlay is open
    if (e.keyCode === 27 && this.isOverlayOpen) {
      this.closeOverlay()
    }
  }

  typingLogic() {
    if (this.searchField.val() !== this.previousValue) {
      clearTimeout(this.typingTimer)

      if (this.searchField.val()) {
        if (!this.isSpinnerVisible) {
          this.resultsDiv.html('<div class="spinner-loader"></div>')
          this.isSpinnerVisible = true
        }
        this.typingTimer = setTimeout(this.getResults.bind(this), 2000)
      } else {
        this.resultsDiv.html('')
        this.isSpinnerVisible = false
      }
    }

    this.previousValue = this.searchField.val()
  }

  getResults() {
    $.getJSON(
      'http://astoria-university.local/wp-json/wp/v2/posts?search=' +
        this.searchField.val(),
      (posts) => {
        this.resultsDiv.html(`
          <h2 class='search-overlay__section-title'>General Information</h2>
          <ul class='link-list min-list'>
            ${posts
              .map(
                (post) =>
                  `<li><a href=${post.link}>${post.title.rendered}</a></li>`,
              )
              .join('')}
          </ul>
        `)
      },
    )
  }
}

export default Search
