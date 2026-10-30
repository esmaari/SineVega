import { defineStore } from "pinia";

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favorites: [] as Array<{
      id: number
      movie_id: number
      movie_title: string
      movie_poster: string
    }>,
  }),

  actions: {
    addToFavorites(movie: { id: number; title: string; poster_path: string }) {
      const alreadyExists = this.favorites.some(
        (fav) => Number(fav.movie_id) === Number(movie.id)
      )

      if (alreadyExists) {
        alert('This movie is already in your favorites.')
        return
      }

      this.favorites.push({
        id: Date.now(),
        movie_id: movie.id,
        movie_title: movie.title,
        movie_poster: movie.poster_path,
      })
      alert('Added to favorites!')
    },

    removeFromFavorites(movie: { id: number }) {
      const existed = this.favorites.some(
        (fav) => Number(fav.movie_id) === Number(movie.id)
      )
      if (!existed) return

      this.favorites = this.favorites.filter(
        (fav) => Number(fav.movie_id) !== Number(movie.id)
      )
      alert('Removed from favorites!')
    },

    clearFavorites() {
      this.favorites = []
    },
  },

  getters: {
    isFavorite: (state) => (movie: { id: number }) =>
      state.favorites.some((fav) => Number(fav.movie_id) === Number(movie.id)),
  },
})
