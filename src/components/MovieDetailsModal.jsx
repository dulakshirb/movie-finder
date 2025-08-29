import { useMemo } from 'react';

const MovieDetailsModal = ({
  movie: {
    title,
    release_date,
    original_language,
    vote_average,
    vote_count,
    popularity,
    poster_path,
    overview,
    genre_ids
  },
  onClose,
  genres = []
}) => {

  const movieGenres = useMemo(() => {
    if (!genre_ids?.length || !genres.length) return [];
    return genre_ids
      .map(id => genres.find(genre => genre.id === id)?.name)
      .filter(Boolean);
  }, [genre_ids, genres]);

  const GenreList = useMemo(() => {
    if (!movieGenres.length) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mb-3">
        {movieGenres.map((genre, index) => (
          <span
            key={index}
            className="bg-gradient-to-r from-[#D6C7FF]/20 to-[#AB8BFF]/20 text-[#D6C7FF] text-xs px-2 py-1 rounded-full border border-[#AB8BFF]/30 transition-all duration-200 hover:from-[#D6C7FF]/30 hover:to-[#AB8BFF]/30"
          >
            {genre}
          </span>
        ))}
      </div>
    );
  }, [movieGenres]);

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[1000] p-4"
      onClick={onClose}
    >
      <div
        className="bg-dark-100 px-8 pt-10 pb-8 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col animate-fadeIn relative overflow-y-auto nice-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 rounded-full bg-dark-200 hover:bg-dark-300 transition-colors"
          aria-label="Close modal"
        >
          <img className="w-4 h-4" src="close.svg" alt="" />
        </button>

        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-2 md:gap-4 flex-1 min-w-0">
            <h2 className="text-lg md:text-3xl font-bold text-white leading-snug ">
              {title}
            </h2>
            <div className="text-light-200 text-sm md:text-lg flex gap-2.5 items-center">
              <span>{release_date?.split("-")[0] || "N/A"}</span>
              <span aria-hidden="true">•</span>
              <span className="uppercase">{original_language}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex md:flex-row flex-col md:gap-2.5 gap-1 items-start text-sm">
            <div className="flex gap-1.5 items-center bg-[#221F3D] px-3 py-1.5 md:px-4 md:py-2 rounded-lg shadow-md">
              <img src="star.svg" alt="" className="w-4 h-4" />
              <span className="text-white font-semibold">
                {vote_average?.toFixed(1) || 'N/A'}
                <span className="text-light-200 text-sm">/10</span>
              </span>
              <span className="text-light-200">({vote_count?.toLocaleString() || 0})</span>
            </div>
            <div className="flex gap-1.5 items-center bg-[#221F3D] px-3 py-1.5 md:px-4 md:py-2 rounded-lg shadow-md">
              <img src="up.svg" alt="" className="w-4 h-4" />
              <span className="text-light-200">{popularity?.toFixed() || 'N/A'}</span>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <main className="mt-6 md:mt-10 flex-1 flex flex-col md:flex-row md:gap-6 gap-3.5 min-h-0 rounded-xl bg-transparent">
          {/* Mobile genres */}
          <div className="md:hidden">
            {GenreList}
          </div>

          <img
            src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : "no-movie.png"}
            alt={`${title} poster`}
            className="rounded-xl shadow-lg w-full md:w-[320px] h-auto object-cover flex-shrink-0"
            loading="lazy"
          />

          {/* Overview Section */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Desktop genres */}
            <div className="hidden md:block">
              {GenreList}
            </div>

            <div className="flex-1 overflow-y-auto nice-scrollbar pr-2 pb-5">
              <p className="text-light-100 leading-relaxed md:text-base text-sm whitespace-pre-wrap">
                {overview || "No description available for this movie."}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MovieDetailsModal;