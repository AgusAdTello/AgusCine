import React, { useState, useEffect } from 'react';
import { Search, Star, Calendar, TrendingUp, Film, X } from 'lucide-react';

const API_KEY = 'af7c45273fdbb72ec664fd3442f8a322'; // Reemplaza con tu API key de TMDB
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function MovieApp() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeTab, setActiveTab] = useState('popular');

  useEffect(() => {
    fetchMovies('popular');
  }, []);

  const fetchMovies = async (endpoint, query = '') => {
    setLoading(true);
    try {
      const url = query
        ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=es-ES`
        : `${BASE_URL}/movie/${endpoint}?api_key=${API_KEY}&language=es-ES`;
      
      const response = await fetch(url);
      const data = await response.json();
      setMovies(data.results || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      fetchMovies('search', searchTerm);
      setActiveTab('search');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
    fetchMovies(tab);
  };

  const fetchMovieDetails = async (id) => {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=es-ES&append_to_response=credits,videos`
      );
      const data = await response.json();
      setSelectedMovie(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Film className="w-8 h-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">CineExplorer</h1>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar películas..."
              className="w-full px-4 py-3 pl-12 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          </form>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            {[
              { id: 'popular', label: 'Popular', icon: TrendingUp },
              { id: 'top_rated', label: 'Mejor Valoradas', icon: Star },
              { id: 'upcoming', label: 'Próximamente', icon: Calendar },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => fetchMovieDetails(movie.id)}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={
                      movie.poster_path
                        ? `${IMG_BASE_URL}${movie.poster_path}`
                        : 'https://via.placeholder.com/500x750?text=Sin+Imagen'
                    }
                    alt={movie.title}
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center gap-2 text-yellow-400 mb-2">
                        <Star className="w-4 h-4 fill-yellow-400" />
                        <span className="font-bold">{movie.vote_average.toFixed(1)}</span>
                      </div>
                      <h3 className="text-white font-semibold text-sm line-clamp-2">
                        {movie.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Movie Detail Modal */}
      {selectedMovie && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedMovie(null)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Backdrop */}
            <div className="relative h-96">
              <img
                src={
                  selectedMovie.backdrop_path
                    ? `https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}`
                    : 'https://via.placeholder.com/1280x720?text=Sin+Imagen'
                }
                alt={selectedMovie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
            </div>

            <div className="p-8 -mt-32 relative z-10">
              <div className="flex gap-6">
                <img
                  src={
                    selectedMovie.poster_path
                      ? `${IMG_BASE_URL}${selectedMovie.poster_path}`
                      : 'https://via.placeholder.com/300x450?text=Sin+Imagen'
                  }
                  alt={selectedMovie.title}
                  className="w-48 rounded-lg shadow-2xl"
                />

                <div className="flex-1">
                  <h2 className="text-4xl font-bold text-white mb-2">
                    {selectedMovie.title}
                  </h2>
                  <p className="text-gray-400 italic mb-4">{selectedMovie.tagline}</p>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-1 rounded-full">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-yellow-400 font-bold">
                        {selectedMovie.vote_average.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-gray-400">
                      {selectedMovie.release_date?.split('-')[0]}
                    </span>
                    <span className="text-gray-400">
                      {selectedMovie.runtime} min
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedMovie.genres?.map((genre) => (
                      <span
                        key={genre.id}
                        className="bg-purple-600/30 text-purple-300 px-3 py-1 rounded-full text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-white mb-2">Sinopsis</h3>
                    <p className="text-gray-300 leading-relaxed">{selectedMovie.overview}</p>
                  </div>

                  {selectedMovie.credits?.cast && (
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Reparto Principal</h3>
                      <div className="flex gap-4 overflow-x-auto pb-2">
                        {selectedMovie.credits.cast.slice(0, 6).map((actor) => (
                          <div key={actor.id} className="flex-shrink-0 text-center">
                            <img
                              src={
                                actor.profile_path
                                  ? `${IMG_BASE_URL}${actor.profile_path}`
                                  : 'https://via.placeholder.com/100x150?text=N/A'
                              }
                              alt={actor.name}
                              className="w-20 h-20 rounded-full object-cover mb-2"
                            />
                            <p className="text-white text-sm font-medium w-20">{actor.name}</p>
                            <p className="text-gray-400 text-xs w-20">{actor.character}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}