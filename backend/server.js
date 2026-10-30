import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createStore } from './store.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin(origin, callback) {
    const allowed = !origin
      || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      || origin === 'https://sinevega-fe-production.up.railway.app';
    callback(null, allowed);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.options('*', cors());
app.use(express.json());

// ✅ dist klasörünü serve et
app.use(express.static(path.join(__dirname, 'dist')));

// Membership and MySQL routes stay in this file to show the original work.
// They are disabled here: a shared database needs a separate server, such as
// the old Railway service, and this portfolio version does not run one.
// Favorites are stored in the browser instead.
const persistAccounts = process.env.ENABLE_MEMBERSHIP === 'true';

const apiKey = process.env.TMDB_API_KEY;
const tmdbApiBaseUrl = process.env.TMDB_BASE_URL;

app.get('/api/popular-movies', async (req, res) => {
  try {
    const response = await axios.get(`${tmdbApiBaseUrl}/movie/popular`, {
      params: {
        api_key: apiKey,
        language: 'en-US',
      },
    });
    res.json(response.data.results);
  } catch (error) {
    console.error('Error fetching data from TMDB API:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

app.get('/api/new-trailers', async (req, res) => {
  try {
    const movieResponse = await axios.get(`${tmdbApiBaseUrl}/movie/popular`, {
      params: {
        api_key: apiKey,
        language: 'en-US',
      },
    });

    const popularMovies = movieResponse.data.results;
    const trailers = [];

    for (const movie of popularMovies) {
      if (trailers.length === 4) break;

      const videoRes = await axios.get(`${tmdbApiBaseUrl}/movie/${movie.id}/videos`, {
        params: { api_key: apiKey },
      });

      const trailer = videoRes.data.results.find(
        (video) => video.site === 'YouTube' && video.type === 'Trailer'
      );

      if (trailer) {
        trailers.push({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          video_url: `https://www.youtube.com/watch?v=${trailer.key}`,
        });
      }
    }

    res.json(trailers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Trailer verisi alınamadı' });
  }
});

app.get('/api/movie/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'ID is required' });
  }

  try {
    const response = await axios.get(`${tmdbApiBaseUrl}/movie/${id}`, {
      params: {
        api_key: apiKey,
        language: 'en-US',
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('API Hatası:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/search', async (req, res) => {
  const searchQuery = req.query.query;
  const page = req.query.page;
  const searchType = req.query.type;

  if (!searchQuery) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  try {
    const response = await axios.get(`${tmdbApiBaseUrl}/search/${searchType}`, {
      params: {
        query: searchQuery,
        page,
        api_key: apiKey,
        language: 'en-US',
      },
    });
    res.json(response.data.results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

if (persistAccounts) {
const store = await createStore();

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ error: 'Username, email and password are required' });
  }

  try {
    const result = await store.register({ username, email, password });
    if (result.error === 'exists') {
      return res.status(400).json({ error: 'Username or email already in use' });
    }
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('DB Insert error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await store.login({ username, password });
    if (result.error === 'not_found') {
      return res.status(404).json({ error: 'User not found' });
    }
    if (result.error === 'bad_password') {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    res.status(200).json({
      username: result.user.username,
      user_id: result.user.id,
    });
  } catch (error) {
    console.error('DB error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/favorites', async (req, res) => {
  const { user_id, movie_id, movie_title, movie_poster } = req.body;

  if (!user_id || !movie_id) {
    return res.status(400).json({ error: 'user_id and movie_id are required' });
  }

  try {
    const favorite = await store.addFavorite({ user_id, movie_id, movie_title, movie_poster });
    res.status(201).json(favorite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Favori eklenemedi' });
  }
});

app.get('/api/favorites/:userId', async (req, res) => {
  try {
    const favorites = await store.getFavorites(req.params.userId);
    res.status(200).json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Favoriler alınamadı' });
  }
});

app.delete('/api/favorites/:id', async (req, res) => {
  try {
    await store.deleteFavorite(req.params.id);
    res.status(200).json({ message: 'Favori başarıyla silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Favori silinemedi' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await store.deleteUser(req.params.id);
    res.status(200).json({ message: 'Kullanici başarıyla silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kullanici silinemedi' });
  }
});
}

app.get('/api/moviecastlist/:id', async (req, res) => {
  const movieId = req.params.id;

  try {
    const response = await axios.get(`${tmdbApiBaseUrl}/movie/${movieId}/credits`, {
      params: { api_key: apiKey, language: 'en-US' },
    });
    res.json(response.data.cast);
  } catch (error) {
    console.error('Cast API Hatası:', error.message);
    res.status(500).json({ error: 'Cast verisi alınamadı' });
  }
});

app.get('/api/trailer/:id', async (req, res) => {
  const movieId = req.params.id;

  try {
    const response = await axios.get(`${tmdbApiBaseUrl}/movie/${movieId}/videos`, {
      params: {
        api_key: apiKey,
        language: 'en-US',
      },
    });

    const trailer = response.data.results.find(
      (video) => video.type === 'Trailer' && video.site === 'YouTube'
    );

    if (!trailer) {
      return res.json({ key: null });
    }

    res.json(trailer);
  } catch (error) {
    console.error('Error fetching trailer:', error);
    res.json({ key: null });
  }
});

app.get('/api/similarmovies/:id', async (req, res) => {
  const movieId = req.params.id;
  try {
    const response = await axios.get(`${tmdbApiBaseUrl}/movie/${movieId}/similar`, {
      params: { api_key: apiKey, language: 'en-US', page: 1 },
    });
    res.json(response.data.results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/person/:personId', async (req, res) => {
  const personId = req.params.personId;

  try {
    const response = await axios.get(`${tmdbApiBaseUrl}/person/${personId}`, {
      params: {
        api_key: apiKey,
        language: 'en-US',
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/person/:personId/credits', async (req, res) => {
  const personId = req.params.personId;

  try {
    const response = await axios.get(`${tmdbApiBaseUrl}/person/${personId}/combined_credits`, {
      params: {
        api_key: apiKey,
        language: 'en-US',
      },
    });

    const castList = response.data.cast;
    const movies = castList.filter((item) => item.media_type === 'movie');
    const tvShows = castList.filter((item) => item.media_type === 'tv');

    res.json({
      movies,
      tv: tvShows,
    });
  } catch (error) {
    console.error('Error fetching person credits:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



const frontendIndex = path.join(__dirname, 'dist', 'index.html');
app.get('*', (req, res) => {
  if (!fs.existsSync(frontendIndex)) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(frontendIndex);
});

app.listen(port, () => {
  console.log(`Backend çalışıyor: http://localhost:${port}`);
});