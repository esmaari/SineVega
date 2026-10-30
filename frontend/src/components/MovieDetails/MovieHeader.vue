<template>
  <section class="bg-secondary text-white py-5">
    <div v-if="movie">
      <div class="container">
          <div class="row">
              <div class="col-4">
                <div class="movie-poster position-relative">
                  <img 
                  :src="movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                  : placeholderMovie"
                  :alt="`${movie.title} Movie Poster`"
                   class="card-img-top object-fit-cover"
                  >
                  <div class="position-absolute bottom-0 start-0 w-100 bg-primary py-3 text-center text-white"> {{ runtimeFormatted }}</div>
                </div>
              </div>
              <div class="col-8 d-flex flex-column gap-3 justify-content-around py-3">
                <h2>{{ movie.title }} ({{ releaseYear }})</h2>
                <button
                  class="btn btn-icon btn-primary text-white"
                  @click="isFavorite ? removeFromFavorites() : addToFavorites()"
                >
                  <i :class="isFavorite ? 'bi bi-suit-heart-fill' : 'bi bi-suit-heart'" class="text-white"></i>
                </button>
                <div>
                    <p><strong>Overview:</strong></p>
                    <p>Release date: {{ movie.release_date }}</p>
                    <p>{{ movie.overview }}</p>
                </div>
                </div>
              </div>
            </div>
          </div>
          
    <p v-else>MovieDetail PAGE Yükleniyor...</p>
  </section>
  
</template>

<script setup lang="ts">

import { ref, onMounted, defineProps, watch, computed } from 'vue'
import { useFavoritesStore } from '../../stores/useFavoritesStore'
import placeholderMovie from '../../assets/placeholders/placeholder-movie.jpg'; 

const props = defineProps<{ movie: any }>()
const favoritesStore = useFavoritesStore()
const isFavorite = ref(false)

const checkFavorite = () => {
  if (!props.movie || !props.movie.id) return;

  isFavorite.value = favoritesStore.favorites.some(
    fav => Number(fav.movie_id) === Number(props.movie.id)
  )
}

const releaseYear = computed(() => {
  return props.movie?.release_date?.slice(0, 4) || '';
});

const runtimeFormatted = computed(() => {
  const minutes = props.movie.runtime || 0;
  const hours = Math.floor(minutes/60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`
})


onMounted(() => {
  checkFavorite()
})

const addToFavorites = async () => {
  await favoritesStore.addToFavorites(props.movie)
  isFavorite.value = true
}

const removeFromFavorites = async () => {
  await favoritesStore.removeFromFavorites(props.movie)
  isFavorite.value = false
}

watch(() => props.movie, (newMovie) => {
  if (newMovie && newMovie.id) {
    checkFavorite()
  }
})
</script>

<style scoped>
  .movie-poster {
    max-height: 450px;
    max-width: 300px;
    aspect-ratio: 2 / 3;
    overflow: hidden;
  }
</style>