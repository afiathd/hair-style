
const renderto = document.querySelector('#content') || document.body.appendChild(document.createElement('div'));
renderto.classList.add('content');

let now = new Date();
//let date = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
let date = now.toLocaleDateString().replaceAll('. ', '-').slice(0,-1);


renderDates(date);

let bookAr;

function renderDates (date) {

    let tpl1 = `
        <div class="container flex-col" id="container">
            <div class="date-ct flex-row" id="date-ct">
                <div class="prev">
                    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16"
                        viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                        <path
                            d="M459.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4L288 214.3V256v41.7L459.5 440.6zM256 352V256 128 96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160C4.2 237.5 0 246.5 0 256s4.2 18.5 11.5 24.6l192 160c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V352z" />
                    </svg>
                </div>
                <div class="date" id="date">${now.toLocaleDateString()}</div>
                <div class="next">
                    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16"
                        viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                        <path
                            d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4L224 214.3V256v41.7L52.5 440.6zM256 352V256 128 96c0-12.4 7.2-23.7 18.4-29s24.5-3.6 34.1 4.4l192 160c7.3 6.1 11.5 15.1 11.5 24.6s-4.2 18.5-11.5 24.6l-192 160c-9.5 7.9-22.8 9.7-34.1 4.4s-18.4-16.6-18.4-29V352z" />
                    </svg>
                </div>
            </div>

            <div class="worker-ct flex-row" id="worker-ct"></div>

        </div>
    `;

    renderto.innerHTML = tpl1;
    

    const next = document.querySelector('.next');
    const prev = document.querySelector('.prev');

    next.addEventListener('click', () => {
        now.setDate(now.getDate() + 1);
        date = now.toLocaleDateString().replaceAll('. ', '-').slice(0,-1);
        renderDates(date);
    });
    
    prev.addEventListener('click', () => {
        now.setDate(now.getDate() - 1);
        date = now.toLocaleDateString().replaceAll('. ', '-').slice(0,-1);
        renderDates(date);
    });

    const workersCt = document.querySelector('#worker-ct');

    fetch('/cards')
        .then(res => res.json())
        .then(workers => {

            let dolgozok = [];

            for (let worker of workers)
                dolgozok.push(new Card(workersCt, worker));

            dolgozok.forEach(dolgozo => {
                dolgozo.render();

                dolgozo.event().addEventListener('click', async () => {

                });
            });


            fetch(`/booked/${date}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
                
            })
                .then(res => res.json())
                .then(bookArr => {
        
                    bookArr.forEach(book => {
        
                        console.log(book.selectedWorker);
        
                         let tpl2 = `
                        <div class="appointment" id="appointment">  
                            <div class="list" id="list">
                                <div class="list_item">
                                    <div class="time">${book.selectedTime}</div>
                                    <div class="client-name">${book.name}</div>
                                    <div class="client-tel">${book.tel}</div>
                                    <div class="client-email">${book.email}</div>
                                    <div class="project">${book.projectName}</div>
                                    <div class="duration">${book.duration}</div>
                                    <div class="price">${book.price}</div>
                                </div>
                            </div>
                        </div>
        
                    `;
        
                    const workerCT = document.querySelector(`#app-${book.selectedWorker}`);
                    workerCT.insertAdjacentHTML('beforeend', tpl2) 
                    })
        
        
                });




        });

    
    

    

}

