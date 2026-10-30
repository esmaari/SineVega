<template>
  <div class="container py-5">
    <div class="row g-4"> 
      <div
        v-for="castMember in visibleCast"
        :key="castMember.id"
        class="col-6 col-md-4 col-lg-2"
      >
      <PersonCard
            :id="castMember.id"
            :key="castMember.id"
            :name="castMember.name"
            :character="castMember.character"
            :profilePath="castMember.profile_path"
          />
      </div>
    </div>

    <div class="text-center pt-2">
      <button class="btn btn-link text-secondary" v-if="castList.length > 6" @click="showAll = !showAll">
        {{ showAll ? 'Show Less' : 'Show All' }}
      </button>
    </div>
  </div>
</template>


<script setup lang="ts">
import axios from 'axios';
import { ref, defineProps, onMounted, computed } from 'vue';
import PersonCard from '../Cards/PersonCard.vue';

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

const props = defineProps<{
  id: number;
}>();

const API_URL = import.meta.env.VITE_API_URL;

const castList = ref<CastMember[]>([]);
const showAll = ref(false);

const fetchMovieCastList = async () => {
  try {
    const response = await axios.get(`${API_URL}/moviecastlist/${props.id}`);
    castList.value = response.data;
  } catch (error) {
    console.log("ERROR: ", error);
  }
};

const visibleCast = computed(() => {
  return showAll.value ? castList.value : castList.value.slice(0, 6);
});

onMounted(fetchMovieCastList);
</script>
