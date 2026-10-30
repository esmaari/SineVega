<script setup lang="ts">
  import Navbar from './components/Navbar.vue';
  import Footer from './components/Footer.vue';
</script>

<template>
  <Navbar />

  <main>
    <router-view :key="$route.fullPath" />
  </main>
  <Footer />
</template>


