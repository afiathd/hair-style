
const renderto = document.querySelector('#content') || document.body.appendChild(document.createElement('div'));
renderto.classList.add('content');

let now = new Date();
//let date = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
let date = now.toLocaleDateString().replaceAll('. ', '-').slice(0, -1);


renderDates(date);

let bookAr;



function renderCards(renderto, date) {

    renderto.innerHTML = "";

    fetch('/cards')
        .then(res => res.json())
        .then(workers => {

            let dolgozok = [];

            for (let worker of workers)
                dolgozok.push(new Card(renderto, worker));

            dolgozok.forEach(dolgozo => {
                dolgozo.render();

            });


            fetch(`/booked/${date}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }

            })
                .then(res => res.json())
                .then(bookArr => {

                    renderItems(bookArr);

                    bookArr.forEach(book => {

                        const appointment = document.querySelector(`#appointment-${book.id}`);

                        appointment.addEventListener('click', () => {

                            const existSaveBtn = document.querySelectorAll('#save');

                            if (existSaveBtn.length == 1) {
                                console.log('Mentés szükséges');
                                console.log(true);
                                const saveMsg = `
                                <div class="card item">
            
                                    <h1>Mentés szükséges!</h1>

                                    <p>Mielőtt másik elemet szerkesztenél, el kell mentened az előző módosítást!</p>

                                    <button class="button" id="ok">OK</button>
                                </div>`;

                                renderto.insertAdjacentHTML('beforeend', saveMsg);

                            } else {

                                console.log(false);
                                edit(book.id);

                                const delBtn = document.querySelector(`.dellink-${book.id}`);
                                const editBtn = document.querySelector(`.editlink-${book.id}`);

                                delBtn.addEventListener('click', () => {
                                    fetch(`/deleteAppointment/${book.id}`, {
                                        method: "DELETE",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },

                                    })
                                        .then((res) => res.json())
                                        .then((message) => {
                                            console.log(message.delete);

                                            const delMsg = `
                                    <div class="card item">
                
                                        <h1>${message.delete}</h1>

                                        <button class="button" id="ok">Bezár</button>
                                    </div>`;

                                            renderto.innerHTML = delMsg;

                                            const ok = document.querySelector('#ok');
                                            ok.addEventListener('click', () => {
                                                renderCards(renderto, date);
                                            })

                                        });

                                })


                                editBtn.addEventListener('click', () => {

                                    console.log('dellink');
                                    console.log(`${book.id}`);

                                    let editTpl = `
                                    <div class="list" id="list">
                                        <div class="client-name"><span>Név:</span><input id="name" value="${book.name}"></input></div>
                                        <div class="list-item">
                                            <div class="time"><span>Időpont:</span><input id="time" value="${book.selectedTime}"></input></div>
                                            <div class="client-tel"><span>Tel:</span><input id="tel" value="${book.tel}"></input></div>
                                            <div class="client-email"><span>Email:</span><input id="email" value="${book.email}"></input></div>
                                            <div class="project"><span>Feladat:</span><input id="projectName" value="${book.projectName}"></input></div>
                                            <div class="duration"><span>Időtartam:</span><input id="duration" value="${book.duration}"></input></div>
                                            <div class="price"><span>Ár:</span><input id="price" value="${book.price}"></input></div>
                                        </div>
                                    </div>
                                    <div class="save flex-row" id="save">mentés</div>
                                `;

                                    const appCt = document.querySelector(`#appointment-${book.id}`)

                                    appCt.innerHTML = "";
                                    appCt.insertAdjacentHTML('beforeend', editTpl);


                                    const save = document.querySelector('#save');


                                    save.addEventListener('click', () => {

                                        let id = book.id;
                                        let name = document.querySelector('#name').value.trim();
                                        let selectedTime = document.querySelector('#time').value;
                                        let tel = document.querySelector('#tel').value;
                                        let email = document.querySelector('#email').value.trim();
                                        let projectName = document.querySelector('#projectName').value.trim();
                                        let duration = document.querySelector('#duration').value;
                                        let price = document.querySelector('#price').value;

                                        fetch(`/editAppointment/${book.id}`, {
                                            method: "PATCH",
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({ id, name, selectedTime, tel, email, projectName, duration, price })
                                        })
                                            .then((res) => res.json())
                                            .then((message) => {
                                                console.log(message.edit);

                                                const editMsg = `
                                                <div class="card item">
                            
                                                    <h1>${message.edit}</h1>

                                                    <button class="button" id="ok">Bezár</button>
                                                </div>`;

                                                renderto.innerHTML = editMsg;

                                                const ok = document.querySelector('#ok');
                                                ok.addEventListener('click', () => {
                                                    renderCards(renderto, date);
                                                })
                                            });


                                    })







                                })
                            }
                        })
                    });

                });

        });

};









function renderDates(date) {

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
        date = now.toLocaleDateString().replaceAll('. ', '-').slice(0, -1);
        renderDates(date);
    });

    prev.addEventListener('click', () => {
        now.setDate(now.getDate() - 1);
        date = now.toLocaleDateString().replaceAll('. ', '-').slice(0, -1);
        renderDates(date);
    });

    const workersCt = document.querySelector('#worker-ct');

    renderCards(workersCt, date);


}




function edit(id) {

    const editCtAll = document.querySelectorAll('.edit');
    editCtAll.forEach(item => item.innerHTML = "edit");

    const tpl3 = ` 
    <div class="dellink-${id}">X</div>
    <div class="editlink-${id}">&#9998;</div>
    `;

    const editCt = document.querySelector(`#edit-${id}`);
    editCt.innerHTML = tpl3;



}


function renderItems(array) {

    array.forEach(item => {

        const workerCT = document.querySelector(`#app-${item.selectedWorker}`);

        console.log(item.selectedWorker);

        let tpl2 = `
        <div class="appointment" id="appointment-${item.id}">  
            <div class="list" id="list">
            <div class="client-name"><span>Név:</span><p>${item.name}</p></div>
                <div class="list-item">
                    <div class="time"><span>Időpont:</span><p>${item.selectedTime}</p></div>
                    <div class="client-tel"><span>Tel:</span><p>${item.tel}</p></div>
                    <div class="client-email"><span>Email:</span><p>${item.email}</p></div>
                    <div class="project"><span>Feladat:</span><p>${item.projectName}</p></div>
                    <div class="duration"><span>Időtartam:</span><p>${item.duration} perc</p></div>
                    <div class="price"><span>Ár:</span><p>${item.price} Ft.</p></div>
                </div>
            </div>
            <div class="edit flex-row" id="edit-${item.id}">edit</div>
        </div>

        `;

        workerCT.innerHTML = tpl2;

    });
};