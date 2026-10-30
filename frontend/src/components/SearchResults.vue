<template>
    <div class="container my-5">
      <SearchInput />
  
      <div class="row mt-4">
        <!-- Kategoriler -->
        <div class="col-md-3 mb-4">
          <div class="bg-secondary-dark text-white p-3 rounded-top">
            <h6 class="mb-0">Categories</h6>
          </div>
          <ul class="list-group rounded-0">
            <li
              class="list-group-item d-flex justify-content-between align-items-center cursor-pointer"
              :class="{ 'active': searchType === 'tv' }"
              @click="changeSearchType('tv')"
              role="button"
            >
              TV Series
            </li>
            <li
              class="list-group-item d-flex justify-content-between align-items-center cursor-pointer"
              :class="{ 'active': searchType === 'movie' }"
              @click="changeSearchType('movie')"
              role="button"
            >
              Movies
            </li>
            <li
              class="list-group-item d-flex justify-content-between align-items-center cursor-pointer"
              :class="{ 'active': searchType === 'person' }"
              @click="changeSearchType('person')"
              role="button"
            >
              Person
            </li>
          </ul>
        </div>
  
        <!-- Sonuçlar -->
        <div class="col-md-9">
          <h2 class="mb-4">Results</h2>
  
          <div v-if="resultList.length" class="row gy-4">
            <!-- Movie & TV Results -->
            <template v-if="searchType === 'movie' || searchType === 'tv'">
              <div
                v-for="item in resultList"
                :key="item.id"
                class="col-12 col-md-6 col-lg-4"
              >
                <MovieCard
                  :id="(item as MovieOrTVResult).id"
                  :title="(item as MovieOrTVResult).title"
                  :posterUrl="(item as MovieOrTVResult).poster_path"
                  :description="(item as MovieOrTVResult).overview"
                  layout="horizontal"
                />
              </div>
            </template>
  
            <!-- Person Results -->
            <template v-else-if="searchType === 'person'">
              <div
                v-for="person in resultList"
                :key="person.id"
                class="col-6 col-md-4 col-lg-2"
              >
                <PersonCard
                  :id="(person as PersonResult).id"
                  :name="(person as PersonResult).name"
                  :profilePath="(person as PersonResult).profile_path"
                />
              </div>
            </template>
          </div>
  
          <div v-else>
            <p>No results found.</p>
          </div>
  
          <!-- Sayfalandırma -->
          <div class="mt-4 d-flex justify-content-center align-items-center gap-3">
            <button
              class="btn btn-outline-dark"
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
            >
              &laquo; Prev
            </button>
  
            <span>Page {{ currentPage }}</span>
  
            <button
              class="btn btn-outline-dark"
              @click="changePage(currentPage + 1)"
            >
              Next &raquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import axios from 'axios'
  
  import SearchInput from './Home/SearchInput.vue'
  import MovieCard from './Cards/MovieCard.vue'
  import PersonCard from './Cards/PersonCard.vue'
  
  const API_URL = import.meta.env.VITE_API_URL
  
  // 🔷 Interface tanımları
  interface MovieOrTVResult {
    id: number
    title: string
    poster_path: string
    overview: string
  }
  
  interface PersonResult {
    id: number
    name: string
    profile_path?: string
  }
  
  // 🔶 Reactif değişkenler
  const route = useRoute()
  const searchQuery = ref<string>(typeof route.query.query === 'string' ? route.query.query : '')
  const searchType = ref<'movie' | 'tv' | 'person'>('movie')
  const currentPage = ref(1)
  const resultList = ref<(MovieOrTVResult | PersonResult)[]>([])
  
  // 🔁 API'den verileri al
  const fetchResult = async (page: number) => {
    try {
      const response = await axios.get(`${API_URL}/search`, {
        params: {
          query: searchQuery.value,
          page,
          type: searchType.value,
        },
      })
      resultList.value = response.data
    } catch (error) {
      console.error('Error fetching resultList:', error)
    }
  }
  
  // 🧭 Kategori değiştirme
  const changeSearchType = (selectedType: 'movie' | 'tv' | 'person') => {
    searchType.value = selectedType
    currentPage.value = 1
    fetchResult(1)
  }
  
  // 📄 Sayfa değiştirme
  const changePage = (page: number) => {
    currentPage.value = page
    fetchResult(currentPage.value)
  }
  
  // 🚀 İlk yüklemede veriyi getir
  onMounted(() => {
    fetchResult(currentPage.value)
  })
  
  // 🔍 Query değişince tekrar ara
  watch(
    () => route.query.query,
    (newQuery) => {
      searchQuery.value = typeof newQuery === 'string' ? newQuery : ''
      fetchResult(1)
    }
  )
  </script>
  