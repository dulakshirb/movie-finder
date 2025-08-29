import { useEffect, useState } from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSeachCount } from './appwrite';
import MovieDetailsModal from './components/MovieDetailsModal';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [genres, setGenres] = useState([]);

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce the search term to prevent making too many API requests
  // by waiting for the user to stop typing for 500ms
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const openModal = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setSelectedMovie(null);
    setIsModalOpen(false);
  }

  const fetchGenres = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/genre/movie/list`, API_OPTIONS);
      if (response.ok) {
        const data = await response.json();
        setGenres(data.genres || []);
      } else {
        console.error('Failed to fetch genres:', response.status);
      }
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchMovies = async (query = '', page = 1, isPageChange = false) => {
    if (isPageChange) {
      setIsPageTransitioning(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage('');

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      if (data.response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      if (isPageChange) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      setMovieList(data.results || []);
      setTotalPages(data.total_pages || 1);
      setCurrentPage(page);

      if (query && data.results.length > 0) {
        await updateSeachCount(query, data.results[0]);
      }

    } catch (error) {
      console.error(`Error fetching movies ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    } finally {
      setIsLoading(false);
      setIsPageTransitioning(false);
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  }

  const getPageNumbers = () => {
    const pages = [];
    const maxButtons = 5;
    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(startPage + maxButtons - 1, totalPages);

    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(endPage - maxButtons + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  const handlePageChange = (page) => {
    if (page !== currentPage && !isPageTransitioning) {
      fetchMovies(debouncedSearchTerm, page, true);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm, 1);
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
    fetchGenres();
  }, [])

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="hero-img.png" alt="Hero Banner" />
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {/* TRENDING MOVIES */}
        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li
                  key={movie.$id}
                  className="cursor-pointer hover:scale-105 transition-transform"
                  onClick={async () => {
                    try {
                      const res = await fetch(`${API_BASE_URL}/movie/${movie.movie_id}`, API_OPTIONS);
                      if (res.ok) {
                        const fullMovie = await res.json();
                        const normalizedMovie = {
                          ...fullMovie,
                          genre_ids: fullMovie.genres ? fullMovie.genres.map(g => g.id) : fullMovie.genre_ids
                        };
                        openModal(normalizedMovie);
                      }
                    } catch (error) {
                      console.error("Failed to fetch full movie details:", error);
                    }
                  }}
                >
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ALL MOVIES */}
        <section className="all-movies">
          <div className='flex md:flex-row flex-col items-center justify-between'>

            <h2>All Movies</h2>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 flex-wrap mt-4 md:mt-0">
                <button
                  className={`px-3 py-1 bg-dark-100 text-indigo-200 rounded hover:bg-light-100/10 disabled:opacity-40 transition-all duration-300 hover:scale-105 ${isPageTransitioning ? 'pointer-events-none opacity-60' : ''
                    }`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isPageTransitioning}
                >
                  Prev
                </button>
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    className={`px-3 py-1 rounded transition-all duration-300 hover:scale-110 ${page === currentPage
                      ? 'bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] text-primary font-bold shadow-lg shadow-[#AB8BFF]/20 scale-105'
                      : `bg-dark-100 text-light-200 hover:bg-light-100/10 hover:text-white ${isPageTransitioning ? 'opacity-60' : ''}`
                      } ${isPageTransitioning ? 'pointer-events-none' : ''}`}
                    onClick={() => handlePageChange(page)}
                    disabled={isPageTransitioning}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className={`px-3 py-1 bg-dark-100 text-indigo-200 rounded hover:bg-light-100/10 disabled:opacity-40 transition-all duration-300 hover:scale-105 ${isPageTransitioning ? 'pointer-events-none opacity-60' : ''
                    }`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isPageTransitioning}
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Movie List */}
          <div className="relative min-h-[400px]">
            {isLoading ? (
              <div className="absolute inset-0 flex justify-center items-center animate-fadeIn">
                <Spinner />
              </div>
            ) : errorMessage ? (
              <div className="absolute inset-0 flex justify-center items-center animate-fadeIn">
                <p className='text-red-500'>{errorMessage}</p>
              </div>
            ) : (
              <div
                className={`transition-all duration-500 ease-out ${isPageTransitioning ? 'opacity-40 scale-[0.98]' : 'opacity-100 scale-100'
                  }`}
              >
                <ul className={`transition-all duration-500 ease-out ${isPageTransitioning ? 'translate-y-3 blur-[1px]' : 'translate-y-0 blur-0'
                  }`}>
                  {movieList.map((movie, index) => (
                    <li
                      key={movie.id}
                      className={`transition-all duration-300 ease-out ${isPageTransitioning ? 'opacity-60' : 'opacity-100'
                        }`}
                      style={{
                        transitionDelay: isPageTransitioning ? '0ms' : `${index * 30}ms`
                      }}
                    >
                      <MovieCard movie={movie} genres={genres} onClick={() => openModal(movie)} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        <footer className='text-gray-500 mt-16 text-sm text-center'>
          Developed by <a href="https://dulakshi.com" target='_blank' className='text-gray-400'>Dulakshi RB</a>
        </footer>

        {/* Details Modal */}
        {isModalOpen && (
          <MovieDetailsModal
            movie={selectedMovie}
            genres={genres}
            onClose={closeModal}
          />
        )}
      </div>
    </main>
  )
}

export default App