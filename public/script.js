
const images = document.querySelectorAll('.sContent');

const active = document.querySelector('.active');


let counter = 0;

checkImage(images, active, counter);

function checkImage(images, active, counter) {

    
    images.forEach(image => {

        let styles = window.getComputedStyle(image);
    
        if(styles.display == 'block'){

            counter++;

            if(counter == 2){ 
                   
                active.classList.remove('active');
            }
    
            return counter
        }
    
    }) 


}


const links = document.querySelectorAll('.link');

links.forEach(link => {
    link.addEventListener('click', () => {
        counter++;
        checkImage(images, active, counter)})
});






const booking = document.querySelector('#booking');

booking.addEventListener('click', () => {

    fetch('/booking', {method: 'GET'});

});