
async function testLogin() {
    try {
        console.log("Testing login with wrong credentials...");
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'wrong@example.com',
                password: 'wrongpassword'
            })
        });

        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Message:", data.message);

        if (data.message === 'Email or password wrong') {
            console.log("SUCCESS: Message matches expected.");
        } else {
            console.log("FAILURE: Message does not match.");
        }

    } catch (error) {
        console.error("Error:", error.message);
    }
}

testLogin();
