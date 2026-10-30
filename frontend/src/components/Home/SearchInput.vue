<template>
  <div class="search-wrapper mt-5">
    <input
      v-model="searchQuery"
      type="text"
      class="form-control form-control-lg"
      placeholder="Search movies..."
      @keyup.enter="goToSearchResults"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const searchQuery = ref('')
const router = useRouter()

const goToSearchResults = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { query: searchQuery.value.trim() } })
  }
}
</script>
