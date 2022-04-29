import axios from 'axios'

class Search {
  // 1. Initiate Search Object
  constructor() {
    // Add html first before any other initialization
    // Otherwise, the variables below won't work
    this.addSearchHTML()

    this.openButton = document.querySelectorAll('.js-search-trigger')
    this.closeButton = document.querySelector('.search-overlay__close')
    this.searchOverlay = document.querySelector('.search-overlay')
    this.searchField = document.getElementById('search-term')
    this.resultsDiv = document.getElementById('search-overlay__results')
    this.isOverlayOpen = false
    this.isSpinnerVisible = false
    this.typingTimer
    this.previousValue
    this.events()
  }

  // 2. Events
  events() {
    // Add click event to the openButton
    // need for loop for two seprate .js-search-trigger classes; one for desktop, another for mobile
    this.openButton.forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault()
        this.openOverlay()
      })
    })

    // Add click event to the closeButton
    this.closeButton.addEventListener('click', () => this.closeOverlay())

    // Add keydown event to document; press s to open up the overlay
    document.onkeydown = (e) => this.keyPressDispatcher(e)

    // Add keyup event to the searchField; logic for showing a spinner loader
    this.searchField.addEventListener('keyup', () => this.typingLogic())
  }

  // 3. Methods
  openOverlay() {
    this.searchOverlay.classList.add('search-overlay--active')
    document.body.classList.add('body-no-scroll')
    this.searchField.value = ''

    setTimeout(() => this.searchField.focus(), 301)
    this.isOverlayOpen = true
  }

  closeOverlay() {
    // Clear out the search results
    this.resultsDiv.value = ''
    this.searchOverlay.classList.remove('search-overlay--active')
    document.body.classList.remove('body-no-scroll')
    this.isOverlayOpen = false
  }

  keyPressDispatcher(e) {
    // if s is pressed down and overlay is not open and any other input/textarea are not focused
    if (
      e.key === 's' &&
      !this.isOverlayOpen &&
      !document.querySelectorAll('input', 'textarea').activeElement
    ) {
      this.openOverlay()
    } else if (e.key === 'Escape' && this.isOverlayOpen) {
      // if escape is pressed down while overlay is open
      this.closeOverlay()
    }
  }

  typingLogic() {
    // Show a spinner loader only if a new search keyword is typed AND the search field is not empty
    // Otherwise, don't show the spinner loader and set the isSpinnerVisible back to false.
    if (this.searchField.value !== this.previousValue) {
      clearTimeout(this.typingTimer) // to start a new timer for each key stroke

      if (this.searchField.value) {
        if (!this.isSpinnerVisible) {
          this.resultsDiv.innerHTML = '<div class="spinner-loader"></div>'
          this.isSpinnerVisible = true
        }
        this.typingTimer = setTimeout(this.getResults.bind(this), 500) // adjust time for the best user expericence
      } else {
        this.resultsDiv.innerHTML = ''
        this.isSpinnerVisible = false
      }
    }

    this.previousValue = this.searchField.value
  }

  async getResults() {
    try {
      const response = await axios.get(
        universityData.root_url +
          '/wp-json/university/v1/search?keyword=' +
          this.searchField.value,
      )
      const results = response.data

      this.resultsDiv.innerHTML = `
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
        `
    } catch (e) {
      console.log(e)
    }
    // hide spinner
    this.isSpinnerVisible = false
  }

  addSearchHTML() {
    document.body.insertAdjacentHTML(
      'beforeend',
      `<div class="search-overlay">
        <div class="search-overlay__top">
            <div class="container">
                <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
                <i class="fa fa-close search-overlay__close" aria-hidden="true"></i>
                <input type="text" class="search-term" placeholder="What are you looking for?" id="search-term"
                    autocomplete="off">
            </div>
        </div>
        <div class="container">
            <div id="search-overlay__results"></div>
        </div>
    </div>`,
    )
  }
}

export default Search
