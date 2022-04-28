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
    $.getJSON(
      universityData.root_url +
        '/wp-json/university/v1/search?keyword=' +
        this.searchField.val(),
      (results) => {
        this.resultsDiv.html(`
        <div class="row">
          <div class="one-third">
            <h2 class='search-overlay__section-title'>General Information</h2>
            ${
              results.generalInfo.length
                ? '<ul class="link-list min-list">'
                : '<p>No general information matches that search. </p>'
            }
              ${results.generalInfo
                .map(
                  (result) =>
                    `<li><a href=${result.permalink}>${result.title}</a> ${
                      result.postType === 'post'
                        ? `by ${result.authorName}`
                        : ''
                    }</li>`,
                )
                .join('')}
            ${results.generalInfo.length ? '</ul>' : ''}
          </div>
          <div class="one-third">
            <h2 class='search-overlay__section-title'>Programs</h2>
            ${
              results.programs.length
                ? '<ul class="link-list min-list">'
                : `<p>No program matches that search. <a href="${universityData.root_url}/programs">View all programs.</a> </p>`
            }
              ${results.programs
                .map(
                  (result) =>
                    `<li><a href=${result.permalink}>${result.title}</a></li>`,
                )
                .join('')}
            ${results.programs.length ? '</ul>' : ''}

            <h2 class='search-overlay__section-title'>Professors</h2>
            ${
              results.professors.length
                ? '<ul class="professor-cards">'
                : '<p>No professor matches that search. </p>'
            }
              ${results.professors
                .map(
                  (result) =>
                    `
                      <li class="professor-card__list-item">
                          <a class="professor-card" href="${result.permalink}">
                              <img class="professor-card__image" src="${result.image}" alt="">
                              <span class="professor-card__name">
                                ${result.title}
                              </span>
                          </a>
                      </li>
                    `,
                )
                .join('')}
            ${results.professors.length ? '</ul>' : ''}
          </div>
          <div class="one-third">
            <h2 class='search-overlay__section-title'>Campuses</h2>
            ${
              results.campuses.length
                ? '<ul class="link-list min-list">'
                : `<p>No campus matches that search. <a href="${universityData.root_url}/campuses">View all campuses.</a></p>`
            }
              ${results.campuses
                .map(
                  (result) =>
                    `<li><a href=${result.permalink}>${result.title}</a></li>`,
                )
                .join('')}
            ${results.campuses.length ? '</ul>' : ''}

            <h2 class='search-overlay__section-title'>Events</h2>
            ${
              results.events.length
                ? ''
                : `<p>No event matches that search. <a href="${universityData.root_url}/events">View all events.</a></p>`
            }
              ${results.events
                .map(
                  (result) =>
                    `
                      <div class="event-summary">
                          <a class="event-summary__date event-summary__date--blue t-center" href="${result.permalink}">
                              <span class="event-summary__month">
                                ${result.month}
                              </span>
                              <span class="event-summary__day">
                                ${result.day}
                              </span>
                          </a>
                          <div class="event-summary__content">
                              <h5 class="event-summary__title headline headline--tiny">
                                  <a href="${result.permalink}">
                                     ${result.title}
                                  </a>
                              </h5>
                              <p>
                                ${result.description} <a href="${result.permalink}" class="nu gray">Read more</a>
                              </p>
                          </div>
                      </div>
                    `,
                )
                .join('')}
          </div>
        </div>
      `)
        this.isSpinnerVisible = false
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
