<template>
  <section class="bg-primary-light">
    <div class="container">
      <div class="row py-5 d-flex">
        <img
          src="../assets/placeholders/userpic_placeholder.png"
          alt="Profile Picture"
          class="col-3 rounded-circle"
          style="width: 250px;"
        />
      <h2 class="col-7 text-white pt-5">Hello</h2>
      <div class="col-2 align-content-end">
        <button class="btn btn-secondary text-white" @click="deleteProfile">delete account</button>
      </div>
      </div>
    </div>
  </section>
  <div class="container"><h2 class="my-4 fw-bold text-secondary-dark">My Favorites</h2></div>

  <div class="container">
    <div class="row gap-3">
      <div v-if="favoritesStore.favorites.length" v-for="movie in favoritesStore.favorites" :key="movie.movie_id" class="col-2">
            <MovieCard
                v-if="movie"
                :id="movie.movie_id"
                :title="movie.movie_title"
                :posterUrl="movie.movie_poster"
            />
      </div>
        <p v-else>No favorites till yet <span>&#128542;</span></p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import MovieCard from './Cards/MovieCard.vue';
  import { useFavoritesStore } from '../stores/useFavoritesStore';

  const favoritesStore = useFavoritesStore()

  const deleteProfile = () => {
    favoritesStore.clearFavorites();
  }
</script>