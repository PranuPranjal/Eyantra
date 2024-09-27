document.getElementById('registration-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const rollno = document.getElementById('rollno').value;
    const branch = document.getElementById('branch').value;
    const year = document.getElementById('year').value;

    const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({name, email, rollno, branch, year})
    });

    const message = await response.text();
    if(response.ok){
        window.location.href='/thankyou.html';
    }
});
