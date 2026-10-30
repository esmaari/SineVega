<template>
    <div class="container mb-5">
        <h2 class="my-4 fw-bold text-secondary-dark">Similar Movies and Series</h2>
        <div v-if="similarMovies.length" class="row g-4">
        <div
            v-for="movie in similarMovies"
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
        <p v-else>No media added to this movie.</p>
    </div>
</template>

<script setup lang="ts">

import axios from 'axios';
import { ref, defineProps, onMounted } from 'vue';
import MovieCard from '../Cards/MovieCard.vue';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
}

const props = defineProps<{
  id: number;
}>();

const API_URL = import.meta.env.VITE_API_URL;
const similarMovies = ref<Movie[]>([]); // 👈 burada tip tanımlandı

const getSimilarMovies = async () => {
  try {
    const response = await axios.get(`${API_URL}/similarmovies/${props.id}`);
    similarMovies.value = response.data.slice(0, 6);
  } catch(error) {
    console.error(error);
  }
};

onMounted(getSimilarMovies);

</script>
