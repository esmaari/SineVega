// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Home from '../components/Home.vue';
import MovieDetail from '../components/MovieDetail.vue';
import SearchResults from '../components/SearchResults.vue';
import PersonDetails from '../components/PersonDetails.vue';
import Terms from '../components/Terms.vue';
import Privacy from '../components/Privacy.vue';
import Impressum from '../components/Impressum.vue';
import About from '../components/About.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/movie/:id', 
    name: 'MovieDetail',
    component: MovieDetail,
    props: true
  },
  {
    path: '/person/:id',
    name: 'PersonDetails',
    component: PersonDetails,
    props: true 
  },
  {
    path: '/search',
    name: 'search',
    component: SearchResults,
  },
  {
    path: '/terms',
    name: 'Terms',
    component: Terms
  },
  {
    path: '/impressum',
    name: 'Impressum',
    component: Impressum
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: Privacy
  },
  {
    path: '/about',
    name: 'About',
    component: About
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
