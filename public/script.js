
//document.querySelector('#link5').click();

const booking = document.querySelector('#booking');

booking.addEventListener('click', () => {

    fetch('/booking', {method: 'GET'});

});