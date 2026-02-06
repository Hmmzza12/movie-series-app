import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config({ path: 'backend/.env' });

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

console.log('Testing TMDB Connection...');
console.log(`Base URL: ${TMDB_BASE_URL}`);
console.log(`API Key present: ${!!TMDB_API_KEY}`);

async function testTMDB() {
    try {
        const url = `${TMDB_BASE_URL}/trending/movie/week`;
        console.log(`Requesting: ${url}`);

        const response = await axios.get(url, {
            params: {
                api_key: TMDB_API_KEY
            }
        });

        console.log('✅ Connection Successful!');
        console.log('Results found:', response.data.results?.length);
        if (response.data.results?.length > 0) {
            console.log('First movie:', response.data.results[0].title);
        }
    } catch (error) {
        console.error('❌ Connection Failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testTMDB();
