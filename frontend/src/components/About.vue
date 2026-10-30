<template>
  <div class="container py-4">
    <h1 class="mb-3">About This Project</h1>

    <p>
      <strong>SineVega</strong> is a personal project for learning and portfolio use only.
      Visitors can browse and search movies. Favorites stay in this browser tab and disappear on refresh.
    </p>

    <p>
      <strong>⚠️ Disclaimer:</strong><br />
      This project is not optimized for mobile devices.<br />
      It is a demo version, and no real user data should be entered.
    </p>

    <hr />

    <h5>Technologies Used</h5>
    <ul>
      <li>Vue.js (Frontend)</li>
      <li>Bootstrap (Styling)</li>
      <li>Express.js (Backend API)</li>
      <li>MySQL (Database)</li>
      <li>TMDB API (Movie Data)</li>
      <li>Railway (Deployment)</li>
    </ul>

    <hr />

    <p>
      Want to give feedback? Contact me: <br />
      Visit my portfolio: <a href="https://esmaari.github.io/" target="_blank">https://esmaari.github.io/</a><br />
      For freelance work: <a href="mailto:esmaari.dev@gmail.com">esmaari.dev@gmail.com</a>
    </p>

    <hr />

    <h5>Credits</h5>
    <p>
      This website uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB.
      SineVega uses that data only for learning and portfolio purposes.
    </p>
    <!-- Official logo file from TMDB. Shown smaller than the SineVega name, with its original colors and shape. -->
    <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">
      <img src="/tmdb-logo.svg" alt="The Movie Database (TMDB)" class="tmdb-logo" />
    </a>
  </div>
</template>

<style scoped>
.tmdb-logo {
  height: 24px;
  width: auto;
}
</style>
