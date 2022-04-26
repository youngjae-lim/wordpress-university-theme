import $ from 'jquery'

class Search {
  // 1. Initiate Search Object
  constructor() {
    this.openButton = $('.js-search-trigger')
    this.closeButton = $('.search-overlay__close')
    this.searchOverlay = $('.search-overlay')
    this.events()
    this.isOverlayOpen = false
  }

  // 2. Events
  events() {
    this.openButton.on('click', this.openOverlay.bind(this))
    this.closeButton.on('click', this.closeOverlay.bind(this))
    $(document).on('keydown', this.keyPressDispatch.bind(this))
  }

  // 3. Methods (functions, action...)
  openOverlay() {
    this.searchOverlay.addClass('search-overlay--active')
    $('body').addClass('body-no-scroll')
    this.isOverlayOpen = true
  }

  closeOverlay() {
    this.searchOverlay.removeClass('search-overlay--active')
    $('body').removeClass('body-no-scroll')
    this.isOverlayOpen = false
  }

  keyPressDispatch(e) {
    // if s is pressed down and overlay is not open
    if (e.keyCode === 83 && !this.isOverlayOpen) {
      this.openOverlay()
    }

    // escape is pressed down and overlay is open
    if (e.keyCode === 27 && this.isOverlayOpen) {
      this.closeOverlay()
    }
  }
}

export default Search
