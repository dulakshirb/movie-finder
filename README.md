# Movie Finder App

A modern, responsive movie discovery application built with React and Vite. Search through thousands of movies, browse trending titles, and view detailed information with smooth animations and transitions.

https://dulakshirb.github.io/movie-finder/

## Features

- **Movie Search**: Real-time search with debounced API calls
- **Trending Movies**: Display most searched movies based on user activity
- **Detailed Movie Information**: Modal with comprehensive movie details including genres, ratings, and descriptions
- **Pagination**: Smooth page transitions with loading states
- **Responsive Design**: Optimized for mobile and desktop devices
- **Search Analytics**: Track search terms and popular movies using Appwrite database

## Tech Stack

- **Frontend**: React with Vite
- **Styling**: Tailwind CSS with custom gradients
- **API**: The Movie Database (TMDB) API
- **Backend**: Appwrite for search analytics
- **State Management**: React Hooks
- **Utilities**: react-use for debouncing

## Prerequisites

Before running this project, you need:

1. **TMDB API Key**: Sign up at [The Movie Database](https://www.themoviedb.org/settings/api)
2. **Appwrite Project**: Create a project at [Appwrite Cloud](https://cloud.appwrite.io/)

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd movie-finder-app
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env.local
```

4. Add your environment variables to `.env.local`:
```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
VITE_APPWRITE_DATABASE_ID=your_appwrite_database_id
VITE_APPWRITE_TABLE_ID=your_appwrite_table_id
```

## Appwrite Setup

1. Create a new database in your Appwrite project
2. Create a table with the following attributes:
   - `searchTerm` (string, required)
   - `count` (integer, required, default: 1)
   - `movie_id` (integer, required)
   - `poster_url` (string, required)

3. Set appropriate permissions for your table

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project Structure

```
src/
├── components/
│   ├── MovieCard.jsx          # Individual movie card component
│   ├── MovieDetailsModal.jsx  # Movie details modal
│   ├── Search.jsx             # Search input component
│   └── Spinner.jsx            # Loading spinner
├── appwrite.js                # Appwrite configuration and functions
├── App.jsx                    # Main application component
└── main.jsx                   # Application entry point
```

## Key Components

### MovieCard
Displays movie information in a card format with poster, title, rating, genre tags, and release year.

### MovieDetailsModal
Shows comprehensive movie details including full poster, description, genres, ratings, and popularity score.

### Search
Debounced search input that triggers API calls 500ms after user stops typing.

## API Integration

### TMDB API Endpoints Used
- `/genre/movie/list` - Fetch movie genres
- `/search/movie` - Search for movies
- `/discover/movie` - Browse popular movies

### Appwrite Functions
- `updateSeachCount()` - Track search terms and increment counts
- `getTrendingMovies()` - Retrieve most popular searched movies

## Features in Detail

### Search Functionality
- Debounced search prevents excessive API calls
- Real-time results with smooth loading transitions
- Search term analytics stored in Appwrite

### Pagination
- Smooth page transitions with opacity and blur effects
- Dynamic page number calculation
- Loading states during page changes

### Movie Details
- Click any movie card to view detailed information
- Responsive modal design
- Genre tags with gradient styling
- Scrollable overview text for long descriptions

### Trending Section
- Shows top 5 most searched movies
- Based on user search analytics
- Updates in real-time as users search

## Styling

The app uses a custom dark theme with purple gradients:
- Primary colors: `#D6C7FF` and `#AB8BFF`
- Dark backgrounds with glass morphism effects
- Smooth hover animations and transitions
- Mobile-first responsive design

## Performance Optimizations

- Debounced search to reduce API calls
- Memoized genre calculations
- Lazy loading for images
- Efficient pagination with smooth transitions
- Optimized re-renders with proper key props

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_TMDB_API_KEY` | Your TMDB API access token | Yes |
| `VITE_APPWRITE_PROJECT_ID` | Appwrite project ID | Yes |
| `VITE_APPWRITE_DATABASE_ID` | Appwrite database ID | Yes |
| `VITE_APPWRITE_TABLE_ID` | Appwrite table ID for analytics | Yes |

## Developer

Developed by [Dulakshi RB](https://dulakshi.com)

## Acknowledgments

- Movie data provided by [The Movie Database (TMDB)](https://www.themoviedb.org/)
- Backend services by [Appwrite](https://appwrite.io/)
- Icons and images from various sources