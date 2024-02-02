

const womanHair = document.querySelector('.center-woman');
const womanPic = document.querySelector('#woman');
const manHair = document.querySelector('.center-man');
const manPic = document.querySelector('#man');


const renderto = document.querySelector('#content') || document.body.appendChild(document.createElement('div'));
renderto.classList.add('content');

let selectedGen;
let selectedWorker;
let selectedDate;
let selectedService;
let selectedWTime;
let selectedPause;
let selectedDay;
let dolgozoWorkDays;
let selectedWorkDay;
let selectedDateStamp;
let selectedPrice;
let booked;


womanHair.addEventListener('click', () => {

    selectedGen = 'woman';
    fetchCard(selectedGen);
})

womanPic.onclick = () => womanHair.click();

manHair.addEventListener('click', () => {
    selectedGen = 'man';
    fetchCard(selectedGen);
})

manPic.onclick = () => manHair.click();


function fetchCard(gender) {

    renderto.innerHTML = '';

    let dolgozok = [];

    /* ----------------------- CARDS ------------------------------------- */

    fetch('/cards')
        .then(res => res.json())
        .then(workers => {

            for (let worker of workers)
                dolgozok.push(new Card(renderto, worker));

            dolgozok.forEach(dolgozo => {
                dolgozo.render();

                dolgozo.event().addEventListener('click', async () => {

                    selectedWorker = dolgozo.id;
                    selectedPause = dolgozo.pause;
                    dolgozoWorkDays = dolgozo.working;

                    renderto.innerHTML = '';

                    /* ----------------------- SERVICES ------------------------------------- */

                    await fetchService(selectedGen, 'services', renderto);

                    const submit = document.querySelector('#submit');

                    submit.addEventListener('click', () => {

                        renderto.innerHTML = '';

                        /* ----------------------- CALENDAR ------------------------------------- */

                        let tpl = `
                    <div class="cal-center">
                        <div class="now-ct">
                            <div class="now">
                                <div class="n-year"></div>
                                <div class="n-month"></div>
                                <div class="n-date"></div>
                                <div class="n-day"></div>
                            </div>
                            <div class="name-day"></div>
                            <div class="cal-pic-item">
                                <img src="${dolgozo.image}" alt="${dolgozo.name}">
                                <h3>${dolgozo.name}</h3>
                            </div>
                        </div>
                        <div class="container" id="calendar"></div>
                    </div>`

                        renderto.innerHTML = tpl;

                        let now = new Date();

                        let year = now.getFullYear();
                        let month = now.getMonth();
                        let date = now.getDate();
                        let day = now.getDay();

                        const yearBox = document.querySelector('.n-year')
                        yearBox.innerHTML = year;

                        const months = {
                            0: "Január",
                            1: "Február",
                            2: "Március",
                            3: "Április",
                            4: "Május",
                            5: "Június",
                            6: "Július",
                            7: "Augusztus",
                            8: "Szeptember",
                            9: "Október",
                            10: "November",
                            11: "December"
                        };

                        const monthBox = document.querySelector('.n-month')
                        monthBox.innerHTML = months[month];

                        const dateBox = document.querySelector('.n-date')
                        dateBox.innerHTML = date;

                        const days = {
                            1: "Hétfő",
                            2: "Kedd",
                            3: "Szerda",
                            4: "Csütörtök",
                            5: "Péntek",
                            6: "Szombat",
                            0: "Vasárnap",
                        };

                        const dayBox = document.querySelector('.n-day')
                        dayBox.innerHTML = days[day];

                        const nameDayBox = document.querySelector('.name-day');

                        fetch('/nevnapok')
                            .then(res => res.json())
                            .then(nameDays => {

                                const now = new Date();

                                const actualNameDays = nameDays[now.getMonth() + 1][now.getDate()];

                                if ((actualNameDays.main.length > 1)) {

                                    actualNameDays.main = actualNameDays.main.join(', ');

                                }


                                nameDayBox.innerHTML = `Ma ünnepli névnapját: ${actualNameDays.main}, boldog névnapot!`;


                            });



                        let cal = new Calendar('#calendar', 6);
                        cal.render();

                        const ct = document.createElement('div');
                        ct.classList.add('date-ct');
                        renderto.appendChild(ct);

                        /* --------------------------- FREE DATES ----------------------------------- */

                        cal.event().forEach(dateBox => {
                            dateBox.addEventListener('click', () => {



                                let date = dateBox.attributes.value.value;
                                selectedDateStamp = new Date(date);

                                selectedDate = dateBox.dataset.date;

                                selectedDay = (selectedDateStamp.getDay());
                                selectedWorkDay = dolgozoWorkDays[selectedDay];

                                ct.innerHTML = '';

                                fetch('/booked', {
                                    method: 'POST',
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({ selectedWorker, selectedDate })
                                })
                                    .then(res => res.json())
                                    .then(foglalasok => {

                                        booked = foglalasok;

                                        let idopontok = hourBreaker(selectedDate, selectedPause, foglalasok, selectedWorkDay, selectedService.time);





                                        const div = document.createElement('div');
                                        div.classList.add('list');
                                        ct.appendChild(div);

                                        div.innerHTML = '';
                                        div.innerText = 'Szabad időpontok:'



                                        for (const idopont in idopontok) {

                                            const iPont = idopontok[idopont];
                                            let [start, end] = iPont.split('-');

                                            start.length < 8 ? start = '0' + start : start = start;
                                            start = start.slice(0, -3);

                                            end.length < 8 ? end = '0' + end : end = end;
                                            end = end.slice(0, -3);

                                            const tpl1 = `
<div class='item' id='${idopontok[idopont]}'>${start} - ${end}</div>
`;

                                            div.insertAdjacentHTML('beforeend', tpl1);

                                            let item = document.getElementById(`${idopontok[idopont]}`)

                                            item.addEventListener('click', () => {

                                                let success = `
                <div class="success">
                <div class="card item">
    
                    <h1>Köszönjük, hogy minket választottál!</h1>
                    <h3>Foglalásod megerősítéséhez add meg adataidat:</h3>
                    <div class="inp">
                        <label for="name">Név:</label><input type="text" id="name" value="sanyi"></input>
                    </div>
                    <div class="inp">
                        <label for="email">Email:</label><input type="email" id="email"  value="sanyi@mail.hu"></input>
                    </div>
                    <div class="inp">
                        <label for="tel">Telefon:</label><input type="tel" id="tel"  value="0612345678"></input>
                    </div>
    
                    <button class="button" id="success">Foglalás</button>
                    <button class="button" id="failed">Mégsem</button>
                </div>
            </div>
`;

                                                renderto.innerHTML = success;

                                                const succBtn = document.querySelector('#success');

                                                const failBtn = document.querySelector('#failed');

                                                failBtn.addEventListener('click', () => location.reload())

                                                succBtn.addEventListener('click', () => {
                                                    const name = document.querySelector('#name').value.trim();
                                                    const email = document.querySelector('#email').value.trim();
                                                    const tel = document.querySelector('#tel').value;


                                                    const project = selectedService.project;
                                                    const projectName = selectedService.name;
                                                    const selectedTime = `${idopontok[idopont]}`;
                                                    const duration = selectedService.time;
                                                    const price = selectedService.price;

                                                    fetch('/booking', {
                                                        method: 'POST',
                                                        headers: {
                                                            "Content-Type": "application/json"
                                                        },
                                                        body: JSON.stringify({ name, email, tel, selectedWorker, selectedGen, project, projectName, selectedDate, selectedTime, 
                                                        duration,
                                                        price })

                                                    })
                                                        .then((res) => res.json())
                                                        .then((message) => {

                                                            renderto.innerHTML = `
                        <div class="card item">
    
                        <h1>${message.success}</h1>

                        <button class="button" id="ok"><a href="/">Bezár</a></button>
                        </div>`


                                                        });

                                                })

                                            });

                                        }

                                    });

                            });
                        });

                    });

                })
            });
        })

        .catch(error => console.error('Hiba történt a fetch során:', error));

}

