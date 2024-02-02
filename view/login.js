
const submit = document.querySelector('#submit');

submit.addEventListener('click', () => {
    const name = document.querySelector('#name').value.trim();
    const password = document.querySelector('#password').value.trim();

    fetch('/login', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({name, password})
    })
        .then( res => res.json() )
        .then( data => {
            if (data.logged)
                location.reload();
            else 
                alert(data.msg);
        });
});

const nameInput = document.querySelector('#name');
const pwInput = document.querySelector('#password');

nameInput.addEventListener("keypress", function(event){
    if (event.key === 'Enter') {
    pwInput.focus();
    }
});

pwInput.addEventListener("keypress", function(event){
    if (event.key === 'Enter') {
    submit.click();
    }
});