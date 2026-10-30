<template>
  <div
    class="card h-100 shadow-sm"
    :class="{ 'flex-row': layout === 'horizontal', 'flex-column': layout !== 'horizontal' }"
    style="display: flex;"
  >
    <div
      class="position-relative"
      :class="{ 'col-4': layout === 'horizontal' }"
      :style="layout !== 'horizontal' ? 'aspect-ratio: 2/3;' : ''"
      style="overflow: hidden;"
    >
      <img      
        :src="posterUrl
        ? `https://image.tmdb.org/t/p/w500/${posterUrl}`
        : placeholderMovie"
        :alt="`${title} poster`"
        class="img-fluid object-fit-cover"
        style="height: 100%; width: 100%; object-fit: cover;"
      />
    </div>

    <div 
      class="d-flex flex-column justify-content-between flex-grow-1"
      :class="{ 'col-8': layout === 'horizontal' }"
    >
      <div class="card-body">
        <h5 class="card-title text-truncate fw-bold">{{ title }}</h5>
        <p
          class="card-text small"
          style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;"
        >
          {{ description }}
        </p>
      </div>
      <div class="card-footer bg-transparent border-top-0">
        <RouterLink
          class="btn btn-primary w-100 text-white"
          :to="{ name: 'MovieDetail', params: { id: id } }"
        >
          View Details
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import placeholderMovie from '../../assets/placeholders/placeholder-movie.jpg'; 

defineProps<{
  id: number;
  title?: string;
  description?: string;
  posterUrl?: string;
  layout?: 'vertical' | 'horizontal'; // optional, default vertical
}>();
</script>
