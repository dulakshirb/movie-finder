import { Client, ID, Query, TablesDB } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(PROJECT_ID)

const database = new TablesDB(client);

export const updateSeachCount = async (searchTerm, movie) => {
  // 1. Use Appwrite SDK to check if the search term exsists in the database
  try {
    const result = await database.listRows(DATABASE_ID, TABLE_ID, [
      Query.equal('searchTerm', searchTerm),
    ]);

    // 2. If it exists, update the search count by 1
    if (result.rows.length > 0) {
      const row = result.rows[0];

      await database.updateRow(DATABASE_ID, TABLE_ID, row.$id, {
        count: row.count + 1,
      });
    } else {
      // 3. If it doesn't exist, create a new record with search count set to 1
      await database.createRow(DATABASE_ID, TABLE_ID, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      })
    }
  } catch (error) {
    console.error(error)
  }
}

export const getTrendingMovies = async () => {
  try {
    const result = await database.listRows(DATABASE_ID, TABLE_ID, [
      Query.limit(10),
      Query.orderDesc("count")
    ]);

    const uniqueMoviesMap = new Map();
    result.rows.forEach(row => {
      if (!uniqueMoviesMap.has(row.movie_id)) {
        uniqueMoviesMap.set(row.movie_id, row);
      }
    })

    return Array.from(uniqueMoviesMap.values()).slice(0, 5);

  } catch (error) {
    console.error(error);
  }
}