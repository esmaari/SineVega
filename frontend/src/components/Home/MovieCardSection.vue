<template>

  <div class="container mb-5">
    <div v-if="movies.length" class="row g-4">
      <div
        v-for="movie in movies"
        :key="movie.id"
        class="col-12 col-sm-2"
        >
          <MovieCard
            :id="movie.id"
            :title="movie.title"
            :description="movie.overview"
            :posterUrl="movie.poster_path"
          />
      </div>
    </div>
    <p v-else>Yükleniyor...</p>
  </div>

</template>


<script setup lang="ts">
  import MovieCard from '../Cards/MovieCard.vue';
  import { ref, onMounted } from 'vue';
  import axios from 'axios';

  interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
  }

  const API_URL = import.meta.env.VITE_API_URL;
  const movies = ref<Movie[]>([]);

  const fetchPopularMovies = async () => {

    try {
      const response = await axios.get(`${API_URL}/popular-movies`);
      movies.value = response.data.slice(0, 6);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  onMounted(() => {
    fetchPopularMovies();
  });
</script>
