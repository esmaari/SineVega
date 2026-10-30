<template>
    <div class="card h-100 shadow-sm">
      <img
        :src="profilePath 
        ? `https://image.tmdb.org/t/p/w500/${profilePath}` 
        : placeholderPerson"
        :alt="`${name} photo`"
        class="card-img-top object-fit-cover"
        style="aspect-ratio: 2/3;"
      />
      <div class="card-body bg-secondary-light d-grid">
        <h6 class="fw-bold mb-1 text-truncate">{{ name }}</h6>        
        <RouterLink
          class="btn btn-link w-100"
          :to="{ name: 'PersonDetails', params: { id: id } }"
        >
          View Details
        </RouterLink>

      </div>
     
    </div>
  </template>
  
  <script setup lang="ts">
  import placeholderPerson from '../../assets/placeholders/placeholder-person.jpg'; 

  defineProps<{
    id: number
    name: string
    profilePath?: string
  }>()
  </script>
  