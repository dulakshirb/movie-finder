const MovieCard = ({ 
  movie: { title, vote_average, poster_path, release_date, original_language, genre_ids },
  onClick,
  genres = []
}) => {

  const getGenreNames = (genreIds) => {
    if (!genreIds || !Array.isArray(genreIds)) return [];
    return genreIds
      .map(id => genres.find(genre => genre.id === id)?.name)
      .filter(Boolean);
  };

  const movieGenres = getGenreNames(genre_ids);

  return (
    <div onClick={onClick} className="movie-card">
      <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : 'no-movie.png'} alt={title} />
      <div className="mt-4">
        <h3>{title}</h3>

        {/* Genre tags */}
        {movieGenres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 mb-3">
            {movieGenres.slice(0, 2).map((genre, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-[#D6C7FF]/20 to-[#AB8BFF]/20 text-[#D6C7FF] text-xs px-2 py-1 rounded-full border border-[#AB8BFF]/30"
              >
                {genre}
              </span>
            ))}
            {movieGenres.length > 2 && (
              <span className="bg-gray-600/20 text-gray-400 text-xs px-2 py-1 rounded-full border border-gray-600/30">
                +{movieGenres.length - 2}
              </span>
            )}
          </div>
        )}

        <div className="content">
          <div className="rating">
            <img src="star.svg" alt="Star Icon" />
            <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
          </div>
          <span>•</span>
          <p className="lang">{original_language}</p>
          <span>•</span>
          <p className="year">{release_date ? release_date.split('-')[0] : 'N/A'}</p>
        </div>
      </div>
    </div>
  )
}

export default MovieCard