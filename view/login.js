
const content = document.querySelector('#content');

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
            if (data.logged){
                location.reload();
            }else{
                myAlert(content, data.msg);

                const alertElement = document.querySelector('.alert');

                setTimeout(function() {

                    content.removeChild(alertElement);

                }, 2000);
            } 
                

                
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




function myAlert(renderto, msg) {


    const alertTpl = `<div class="alert">
    <p id="alert">${msg}</p>
    </div>`;

    renderto.insertAdjacentHTML('beforeend', alertTpl)


} 