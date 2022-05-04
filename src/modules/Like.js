import axios from 'axios'

class Like {
  constructor() {
    if (document.querySelector('.like-box')) {
      // Even if you're logged in, you can't 'like' or 'delete like' without sending nonce to the server
      axios.defaults.headers.common['X-WP-Nonce'] = universityData.nonce
      this.events()
    }
  }

  events() {
    document
      .querySelector('.like-box')
      .addEventListener('click', (e) => this.ourClickDispatcher(e))
  }

  // methods
  ourClickDispatcher(e) {
    let currentLikeBox = e.target
    // Get the wrapping parent element having 'like-box' class
    // This is needed in case we have multiple like buttons on a single page
    // In other words, we need a very specific like-box that contains the clicked like button
    while (!currentLikeBox.classList.contains('like-box')) {
      currentLikeBox = currentLikeBox.parentElement
    }

    // Toggle the like button depending on 'data-exists' property
    if (currentLikeBox.getAttribute('data-exists') == 'yes') {
      this.deleteLike(currentLikeBox)
    } else {
      this.createLike(currentLikeBox)
    }
  }

  async createLike(currentLikeBox) {
    try {
      // Send a HTTP POST request with a professor id to the server
      const response = await axios.post(
        universityData.root_url + '/wp-json/university/v1/manageLike',
        { professorId: currentLikeBox.getAttribute('data-professor') },
      )

      if (response.data != 'Only logged in users can create a like.') {
        currentLikeBox.setAttribute('data-exists', 'yes')

        // Parse string to integer
        var likeCount = parseInt(
          currentLikeBox.querySelector('.like-count').innerHTML,
          10,
        )

        // Increase the number of likes by 1
        likeCount++

        // Update the number of likes
        currentLikeBox.querySelector('.like-count').innerHTML = likeCount

        // Set 'data-like' attribute to the id of the created like post
        // This id will be sent to the server when deleting like
        currentLikeBox.setAttribute('data-like', response.data)
      }
      console.log(response.data)
    } catch (e) {
      console.log('You are not authorized to like the professor.')
    }
  }

  async deleteLike(currentLikeBox) {
    try {
      // Send a HTTP DELETE request with the id of the created like post
      const response = await axios({
        url: universityData.root_url + '/wp-json/university/v1/manageLike',
        method: 'delete',
        data: { like: currentLikeBox.getAttribute('data-like') },
      })

      currentLikeBox.setAttribute('data-exists', 'no')

      // Parse string to integer
      var likeCount = parseInt(
        currentLikeBox.querySelector('.like-count').innerHTML,
        10,
      )

      // Decrease the number of likes by 1
      likeCount--

      // Update the number of likes
      currentLikeBox.querySelector('.like-count').innerHTML = likeCount

      // Reset 'data-like' attribute to empty
      currentLikeBox.setAttribute('data-like', '')
      console.log(response.data)
    } catch (e) {
      console.log(e)
    }
  }
}

export default Like
