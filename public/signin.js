document.getElementById('signin-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();
    if (response.ok) {
        localStorage.setItem('userName', result.name);
        window.location.href = '/index.html';
    } else {
        document.getElementById('message').innerText = result.message;
    }
});