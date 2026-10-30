const TMDB_BASE_URL = "https://api.themoviedb.org/3";

function reply(body, status = 200) {
  return {
    statusCode: status,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  };
}

function requestPath(event) {
  const raw = event.rawUrl || event.path || "";
  let pathname = raw;
  try {
    pathname = new URL(raw, "https://sinevega.netlify.app").pathname;
  } catch {
    pathname = event.path || "";
  }
  const marker = "/.netlify/functions/api/";
  if (pathname.includes(marker)) {
    return pathname.slice(pathname.indexOf(marker) + marker.length);
  }
  return pathname.replace(/^\/api\/?/, "");
}

async function tmdb(path, params = {}) {
  const apiKey = process.env.TMDB_API_KEY || process.env.VITE_TMDB_API_KEY;
  if (!apiKey) {
    const error = new Error("TMDB_API_KEY is not set");
    error.status = 500;
    throw error;
  }

  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("language", "en-US");
  for (const [name, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(name, String(value));
    }
  }

  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error("TMDB request failed");
    error.status = response.status;
    throw error;
  }
  return response.json();
}

function isSafeId(value) {
  return /^\d+$/.test(value || "");
}

export async function handler(event) {
  try {
  const [resource, first, second] = requestPath(event).split("/").filter(Boolean);
  const query = event.queryStringParameters || {};
    if (resource === "popular-movies") {
      const data = await tmdb("/movie/popular");
      return reply(data.results);
    }

    if (resource === "new-trailers") {
      const data = await tmdb("/movie/popular");
      const trailers = [];
      for (const movie of data.results) {
        if (trailers.length === 4) break;
        const videos = await tmdb(`/movie/${movie.id}/videos`, { language: undefined });
        const trailer = videos.results.find(
          (video) => video.site === "YouTube" && video.type === "Trailer"
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
      return reply(trailers);
    }

    if (resource === "movie" && isSafeId(first)) {
      return reply(await tmdb(`/movie/${first}`));
    }

    if (resource === "search") {
      if (!query.query) {
        return reply({ message: "Query parameter is required" }, 400);
      }
      if (!["movie", "tv", "person"].includes(query.type)) {
        return reply({ message: "Invalid search type" }, 400);
      }
      const data = await tmdb(`/search/${query.type}`, {
        query: query.query,
        page: query.page,
      });
      return reply(data.results);
    }

    if (resource === "moviecastlist" && isSafeId(first)) {
      const data = await tmdb(`/movie/${first}/credits`);
      return reply(data.cast);
    }

    if (resource === "trailer" && isSafeId(first)) {
      const data = await tmdb(`/movie/${first}/videos`);
      const trailer = data.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      return reply(trailer || { key: null });
    }

    if (resource === "similarmovies" && isSafeId(first)) {
      const data = await tmdb(`/movie/${first}/similar`, { page: 1 });
      return reply(data.results);
    }

    if (resource === "person" && isSafeId(first) && second === "credits") {
      const data = await tmdb(`/person/${first}/combined_credits`);
      return reply({
        movies: data.cast.filter((item) => item.media_type === "movie"),
        tv: data.cast.filter((item) => item.media_type === "tv"),
      });
    }

    if (resource === "person" && isSafeId(first) && !second) {
      return reply(await tmdb(`/person/${first}`));
    }

    return reply({ error: "Not found" }, 404);
  } catch (error) {
    console.error(error);
    const missingKey = error.message === "TMDB_API_KEY is not set";
    return reply(
      { message: missingKey ? "TMDB_API_KEY is not set" : "Internal Server Error" },
      error.status || 500
    );
  }
}
