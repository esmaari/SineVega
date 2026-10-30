<template>
  <section
    class="text-white d-flex align-items-center bg-secondary-dark pb-5"
  >
    <div class="container">
      <h2 class="text-center my-4 fw-bold text-white">Latest Trailers</h2>

      <div class="row g-4">
        <div
          class="col-12 col-sm-6 col-lg-3"
          v-for="trailer in trailers"
          :key="trailer.id"
        >
          <TrailerCard
            :id="trailer.id"
            :title="trailer.title"
            :thumbnailUrl="`https://image.tmdb.org/t/p/w500/${trailer.poster_path}`"
            :videoUrl="trailer.video_url || ''"
          />
        </div>
      </div>
    </div>

  </section>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import TrailerCard from '../Cards/TrailerCard.vue';

const API_URL = import.meta.env.VITE_API_URL || "/api";

interface Trailer {
  id: number;
  title: string;
  poster_path: string;
  video_url?: string; 
}

const trailers = ref<Trailer[]>([]);

const fetchPopularNewTrailers = async () => {
  try {
    const response = await axios.get(`${API_URL}/new-trailers`);
    trailers.value = response.data;
  } catch (error) {
    console.error('Error fetching trailers:', error);
  }
};

onMounted(() => {
  fetchPopularNewTrailers();
});
</script>
