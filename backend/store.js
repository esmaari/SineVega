import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createMysqlConnection, hasMysqlConfig, mysqlHost } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.join(__dirname, 'data', 'local-db.json');

function nowIso() {
  return new Date().toISOString();
}

function seed() {
  const now = nowIso();
  return {
    users: [
      {
        id: 1,
        username: 'sinevega_user',
        email: 'sinevega_user@demo.local',
        password: 'User@1234',
        created_at: now,
        last_active: now,
      },
    ],
    favorites: [],
  };
}

function loadLocal() {
  try {
    const raw = fs.readFileSync(dataFile, 'utf8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.users) || !Array.isArray(parsed.favorites)) {
      throw new Error('Invalid local database');
    }
    return parsed;
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn('Could not read the local database. Recreating it with demo data.');
    }
    const initial = seed();
    saveLocal(initial);
    return initial;
  }
}

function saveLocal(db) {
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  fs.writeFileSync(dataFile, JSON.stringify(db, null, 2));
}

function nextId(rows) {
  return rows.reduce((max, row) => Math.max(max, Number(row.id) || 0), 0) + 1;
}

function sameText(left, right) {
  return String(left || '').trim().toLowerCase() === String(right || '').trim().toLowerCase();
}

function createLocalStore() {
  const db = loadLocal();

  return {
    mode: 'local',
    async register({ username, email, password }) {
      const taken = db.users.some(
        (user) => sameText(user.username, username) || sameText(user.email, email)
      );
      if (taken) return { error: 'exists' };

      const now = nowIso();
      const user = {
        id: nextId(db.users),
        username: username.trim(),
        email: email.trim(),
        password,
        created_at: now,
        last_active: now,
      };
      db.users.push(user);
      saveLocal(db);
      return { user };
    },

    async login({ username, password }) {
      const user = db.users.find((row) => sameText(row.username, username));
      if (!user) return { error: 'not_found' };
      if (user.password !== password) return { error: 'bad_password' };

      user.last_active = nowIso();
      saveLocal(db);
      return { user };
    },

    async addFavorite({ user_id, movie_id, movie_title, movie_poster }) {
      const favorite = {
        id: nextId(db.favorites),
        user_id: Number(user_id),
        movie_id: Number(movie_id),
        movie_title,
        movie_poster,
        created_at: nowIso(),
      };
      db.favorites.push(favorite);
      saveLocal(db);
      return favorite;
    },

    async getFavorites(userId) {
      return db.favorites.filter((row) => Number(row.user_id) === Number(userId));
    },

    async deleteFavorite(id) {
      const before = db.favorites.length;
      db.favorites = db.favorites.filter((row) => Number(row.id) !== Number(id));
      saveLocal(db);
      return db.favorites.length < before;
    },

    async deleteUser(id) {
      const before = db.users.length;
      db.users = db.users.filter((row) => Number(row.id) !== Number(id));
      db.favorites = db.favorites.filter((row) => Number(row.user_id) !== Number(id));
      saveLocal(db);
      return db.users.length < before;
    },
  };
}

// Original MySQL queries for register, login, and favorites.
// Unused in this portfolio version: a shared database needs a separate
// server, such as the old Railway service. Favorites stay in the browser.
function createMysqlStore(connection) {
  return {
    mode: 'mysql',
    async register({ username, email, password }) {
      const [existing] = await connection.query(
        'SELECT id FROM users WHERE username = ? OR email = ?',
        [username, email]
      );
      if (existing.length > 0) return { error: 'exists' };

      const now = new Date();
      const [result] = await connection.query(
        'INSERT INTO users (username, email, password, created_at, last_active) VALUES (?, ?, ?, ?, ?)',
        [username, email, password, now, now]
      );
      return { user: { id: result.insertId, username, email } };
    },

    async login({ username, password }) {
      const [rows] = await connection.query(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      if (rows.length === 0) return { error: 'not_found' };

      const user = rows[0];
      if (user.password !== password) return { error: 'bad_password' };

      connection
        .query('UPDATE users SET last_active = ? WHERE id = ?', [new Date(), user.id])
        .catch((error) => console.error('Failed to update last_active:', error));

      return { user };
    },

    async addFavorite({ user_id, movie_id, movie_title, movie_poster }) {
      const now = new Date();
      const [result] = await connection.query(
        'INSERT INTO favorites (user_id, movie_id, movie_title, movie_poster, created_at) VALUES (?, ?, ?, ?, ?)',
        [user_id, movie_id, movie_title, movie_poster, now]
      );
      return {
        id: result.insertId,
        user_id,
        movie_id,
        movie_title,
        movie_poster,
        created_at: now,
      };
    },

    async getFavorites(userId) {
      const [rows] = await connection.query(
        'SELECT * FROM favorites WHERE user_id = ?',
        [userId]
      );
      return rows;
    },

    async deleteFavorite(id) {
      const [result] = await connection.query('DELETE FROM favorites WHERE id = ?', [id]);
      return result.affectedRows > 0;
    },

    async deleteUser(id) {
      const [result] = await connection.query('DELETE FROM users WHERE id = ?', [id]);
      return result.affectedRows > 0;
    },
  };
}

function shouldUseLocalStore() {
  if (process.env.USE_LOCAL_DB === 'true') return true;
  if (process.env.USE_LOCAL_DB === 'false') return false;
  const host = mysqlHost();
  return !hasMysqlConfig() || host.includes('railway.internal');
}

export async function createStore() {
  if (shouldUseLocalStore()) {
    console.log(`Local database file: ${dataFile}`);
    return createLocalStore();
  }

  try {
    const connection = await createMysqlConnection();
    await connection.query('SELECT 1');
    console.log('Connected to MySQL');
    return createMysqlStore(connection);
  } catch (error) {
    console.warn(`MySQL is unavailable (${error.message}). Using the local database.`);
    return createLocalStore();
  }
}
