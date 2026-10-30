<template>

  <div class="card border-0 shadow-sm">
    
  <a
  :href="videoUrl"
  target="_blank"
  rel="noopener noreferrer"
  class="trailer-thumbnail-link position-relative d-block overflow-hidden rounded"
>
  <div class="ratio ratio-16x9">
    <img
      :src="thumbnailUrl || '/placeholder-16x9.png'"
      :alt="`${title} trailer thumbnail`"
      class="img-fluid object-fit-cover"
      style="object-fit: cover;"
    />
  </div>

  <div class="play-icon position-absolute top-50 start-50">
    <i class="bi bi-play-fill h1 text-secondary display-1"></i>
  </div>
</a>


  <div class="card-body px-3 py-2">
    <h5 class="fw-semibold text-truncate mb-2 text-center">{{ title }}</h5>
  </div>

    <div class="card-footer bg-transparent border-top-0">
      <RouterLink class="btn btn-link w-100" :to="{ name: 'MovieDetail', params: { id: id } }">
        View Details
      </RouterLink>
  </div>
</div>
</template>


<script setup lang="ts">
defineProps<{
    id: number
    title: string
    thumbnailUrl: string;
    videoUrl?: string
}>()
</script>

<style scoped>

.play-icon {
  transition: transform 0.3s ease;
  transform: translate(-50%, -50%);
  pointer-events: auto; /* default zaten */
}

.trailer-thumbnail-link:hover .play-icon {
  transform: translate(-50%, -50%) scale(1.1);
}

</style>
