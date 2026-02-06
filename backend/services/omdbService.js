import axios from 'axios';

const OMDB_API_KEY = process.env.OMDB_API_KEY;
const OMDB_BASE_URL = 'http://www.omdbapi.com/';

export const getExternalRatings = async (imdbId) => {
    if (!OMDB_API_KEY || !imdbId) return null;

    try {
        const response = await axios.get(OMDB_BASE_URL, {
            params: {
                apikey: OMDB_API_KEY,
                i: imdbId
            }
        });

        if (response.data.Response === 'True') {
            return response.data.Ratings; // Returns array: [{Source: "Internet Movie Database", Value: "8.1/10"}, {Source: "Rotten Tomatoes", Value: "92%"}]
        }
        return null;
    } catch (error) {
        console.error('OMDB API Error:', error.message);
        return null;
    }
};
