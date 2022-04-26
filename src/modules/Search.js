import $ from 'jquery'

class Search {
  // 1. Initiate Search Object
  constructor() {
    this.addSearchHTML()
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
    this.searchField.val('')
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
        this.typingTimer = setTimeout(this.getResults.bind(this), 500)
      } else {
        this.resultsDiv.html('')
        this.isSpinnerVisible = false
      }
    }

    this.previousValue = this.searchField.val()
  }

  getResults() {
    $.when(
      $.getJSON(
        universityData.root_url +
          '/wp-json/wp/v2/posts?search=' +
          this.searchField.val(),
      ),
      $.getJSON(
        universityData.root_url +
          '/wp-json/wp/v2/pages?search=' +
          this.searchField.val(),
      ),
    ).then(
      (posts, pages) => {
        var combinedResults = posts[0].concat(pages[0])
        this.resultsDiv.html(`
        <h2 class='search-overlay__section-title'>General Information</h2>
        ${
          combinedResults.length
            ? '<ul class="link-list min-list">'
            : '<p>No general information matches that search. </p>'
        }
          ${combinedResults
            .map(
              (result) =>
                `<li><a href=${result.link}>${result.title.rendered}</a></li>`,
            )
            .join('')}
        ${combinedResults.length ? '</ul>' : ''}
      `)
        this.isSpinnerVisible = false
      },
      () => {
        this.resultsDiv.html('<p>Unexpected error; please try again.</p>')
      },
    )
  }

  addSearchHTML() {
    $('body').append(`
      <!-- Live Search Bar -->
      <div class="search-overlay">
        <div class="search-overlay__top">
          <div class="container">
            <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
            <input type="text" class="search-term" autocomplete="off" placeholder="What are your looking for?" id="search-term">
            <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
          </div>
        </div>

        <div class="container">
          <div id="search-overlay__results"></div>
        </div>
      </div>
    `)
  }
}

export default Search
