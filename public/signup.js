document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const cnfpassword = document.getElementById('cnfpassword').value;

    const response = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({name, email, password, cnfpassword})
    });

    const message = await response.text();
    if(response.ok){
        window.location.href='/index.html';
        document.getElementById('message').innerText = message;
    }
    document.getElementById('message').innerText = message;
});


