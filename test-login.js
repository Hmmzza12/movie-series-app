
const axios = require('axios');

async function testLogin() {
    try {
        console.log("Testing correct login...");
        // Assuming there is no user 'wrong@example.com'
        await axios.post('http://localhost:5000/api/auth/login', {
            email: 'wrong@example.com',
            password: 'wrongpassword'
        });
    } catch (error) {
        if (error.response) {
            console.log("Status:", error.response.status);
            console.log("Data:", error.response.data);
        } else {
            console.log("Error:", error.message);
        }
    }
}

testLogin();
