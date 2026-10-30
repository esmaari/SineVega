<template>
  <section
    class="hero-section text-white d-flex align-items-center"
    :style="`background-image: url(${heroBanner})`"
  >
    <div class="container">
      <div class="row">
        <div class="col-lg-8 text-start">
          <h1 class="display-4 fw-bold mb-3">Explore. Discover. Watch.</h1>
          <p class="fs-3">Millions of movies, shows, and people await.</p>
          <SearchInput />
        </div>
      </div>
    </div>
  </section>
</template>
  
  
<script setup lang="ts">
    import heroBanner from '../../assets/hero-banner.png'
    import SearchInput from './SearchInput.vue';
</script>


<style scoped>
.hero-section {
  background-size: cover;
  background-position: center;
  height: 422px;
}
</style>
