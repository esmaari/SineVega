import { defineStore } from 'pinia'
import { useFavoritesStore } from './useFavoritesStore';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as null | {
      user_id: number
      username: string
      email?: string
    }
  }),

  actions: {
    getUser() {
      const raw = localStorage.getItem('user')
      if (raw) {
        this.user = JSON.parse(raw)
      }
    },

    setUser(data: any) {
      this.user = data
      localStorage.setItem('user', JSON.stringify(data))
    },

    logout() {
      this.user = null
      localStorage.removeItem('user')
      localStorage.removeItem('user');
      const favoritesStore = useFavoritesStore();
      favoritesStore.clearFavorites(); // 🟢
    },

    clearUser() {
      this.user = null;
    },
  },

  getters: {
    isLoggedIn: (state) => !!state.user,
    userId: (state) => state.user?.user_id || null,
    username: (state) => state.user?.username || '',
  }
})
