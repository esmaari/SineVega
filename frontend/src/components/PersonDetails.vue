<template>
    <section v-if="person" class="py-5">
      <div class="container">
        <div class="row g-5">
          <div class="col-md-4">
            <div class="person-img shadow-sm">
              <img
                :src="person.profile_path
                  ? `https://image.tmdb.org/t/p/w500/${person.profile_path}`
                  : placeholderPerson"
                :alt="person.name"
                class="card-img-top"
              />
            </div>

            <div class="mt-3">
                <h5 class="">{{ person.name }}</h5>
                <p class="small text-muted mb-3"><strong>Known for:</strong> {{ person.known_for_department }}</p>
                <p class="small mb-3"><strong>Gender:</strong> {{ person.gender === 1 ? 'Female' : 'Male' }}</p>
                <p class="small mb-3"><strong>Birthday:</strong> {{ person.birthday }}</p>
                <p class="small mb-3"><strong>Place of Birth:</strong> {{ person.place_of_birth }}</p>
                <p class="small mb-0"><strong>Also Known As:</strong> {{ person.also_known_as?.join(', ') }}</p>
              </div>
          </div>

          <div class="col-md-8">
            <div class="mb-4">
              <h4>Biography</h4>
              <p class="text-muted">{{ visivleBio || 'No biography available.' }}</p>
              <div class="text-center">
                <button v-if="!showAllBio" @click="showAllBio=!showAllBio" class="btn btn-link">Show all</button>
                <button v-else @click="showAllBio=!showAllBio" class="btn btn-link">Show less</button>
              </div>
            </div>

            <div v-if="credits?.movies?.length" class="mb-4">
              <h4 class="mb-3">Movies</h4>
              <div class="row g-3">
                <div
                  v-for="movie in credits.movies"
                  :key="movie.id"
                >
                  <div class="card h-100 shadow-sm">
                    <div class="row g-0">
                        <MovieCard v-if="movie" :id="movie.id" :title="movie.title" :posterUrl="movie.poster_path" :description="movie.overview" layout="horizontal" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <div v-if="credits?.tv?.length">
              <h4 class="mb-3">Series</h4>
              <div class="row g-3">
                <div
                  v-for="show in credits.tv"
                  :key="show.id"
                >
                  <div class="card h-100 shadow-sm">
                    <div class="row g-0">
                        <MovieCard v-if="show" :id="show.id" :title="show.title" :posterUrl="show.poster_path" :description="show.overview" layout="horizontal" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
          </div>
        </div>
      </div>
    </section>
  
    <p v-else class="text-center my-5">Loading person details...</p>
  </template>
  

  <script setup lang="ts">
  
  import { ref, onMounted, defineProps, computed } from 'vue';
  import axios from 'axios';
  import MovieCard from './Cards/MovieCard.vue';
  import placeholderPerson from '../assets/placeholders/placeholder-person.jpg'; 
  
  const API_URL = import.meta.env.VITE_API_URL || "/api";
  
  const props = defineProps<{
    id: string | number
  }>();
  
  const person = ref<any>(null);
  const credits = ref<{ movies: any[]; tv: any[] }>({
    movies: [],
    tv: []
  });
  const showAllBio = ref(false);
  const visivleBio = computed(() => {
    if (showAllBio.value) {
      return person.value.biography;
    } else {
      return person.value.biography?.slice(0, 300) + '...';
    }
  });


  const fetchPersonDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/person/${props.id}`);
      person.value = response.data;
    } catch (error) {
      console.error('Error fetching person:', error);
    }
  };
  
  const fetchPersonCredits = async () => {
    try {
      const response = await axios.get(`${API_URL}/person/${props.id}/credits`);
      credits.value = {
        movies: response.data.movies || [],
        tv: response.data.tv || []
      };
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };
  
  onMounted(() => {
    fetchPersonDetails();
    fetchPersonCredits();
  });
  </script>

<style scoped>
.person-img {
  max-height: 450px;
  max-width: 300px;
  aspect-ratio: 2 / 3;
  overflow: hidden;
}
</style>
  