<template>
    <section class="bg-secondary-dark">
        <div class="container text-center py-5">
            <h2 class="pb-4 fw-bold text-white">Watch Trailer</h2>
            <div class="ratio ratio-16x9">
                <iframe
                    v-if="trailer?.key"
                   :src="`https://www.youtube.com/embed/${trailer.key}`"
                    title="YouTube video player"
                    allowfullscreen
                ></iframe>
            <div v-else>No trailer found for this movie!</div>
            </div>
        </div>
    </section>

</template>

<script setup lang="ts">
import axios from 'axios';
import { onMounted, defineProps, ref } from 'vue';

const API_URL = import.meta.env.VITE_API_URL || "/api";

interface Trailer {
  key: string;
}

const trailer = ref<Trailer | null>(null);

const props = defineProps<{
  id: number;
}>();

const getMovieTrailer = async () => {
  try {
    const response = await axios.get(`${API_URL}/trailer/${props.id}`);
    if (response.data && response.data.key) {
      trailer.value = response.data;
    } else {
      trailer.value = null;
    }
  } catch (error) {
    console.warn('No trailer found or error fetching trailer:', error);
    trailer.value = null;
  }
};

onMounted(getMovieTrailer);
</script>
