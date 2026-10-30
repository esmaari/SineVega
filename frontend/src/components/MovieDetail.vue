<template>
  <MovieHeader v-if="movie" :movie="movie" />
  <CastList v-if="movie" :id="movie.id" />
  <DetailTrailerSection v-if="movie" :id="movie.id" />
  <SimilarMovies v-if="movie" :id="movie.id"/>
</template>
  
<script setup lang="ts">

  import MovieHeader from './MovieDetails/MovieHeader.vue'
  import CastList from './MovieDetails/CastList.vue';
  import DetailTrailerSection from './MovieDetails/DetailTrailerSection.vue';
  import SimilarMovies from './MovieDetails/SimilarMovies.vue';
  import axios from 'axios';
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute(); 

  interface Movie {
    id: number;
    title: string;
    poster_path: string;
    overview: string;
    release_date: string;
  }

  const movie = ref<Movie | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || "/api";

  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/movie/${route.params.id}`); // comes from movieDB via server
      movie.value = response.data;

    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  
  onMounted(async () => {
    await fetchMovieDetails();
  
  });


</script>
