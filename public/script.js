
const booking = document.querySelector('#booking');

booking.addEventListener('click', () => {
    console.log('banana');

    fetch('/booking', {method: 'GET'});

});