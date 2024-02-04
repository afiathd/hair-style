

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
let selectedTime;


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

                        const alert = document.querySelector('#alert');

                        if (selectedService == undefined) {
                            console.log(selectedService);
                            alert.innerHTML = 'Válassz szolgáltatást!';
                            alert.classList.add('alert-bg');

                        } else {

/* ----------------------- CALENDAR ------------------------------------- */


                            renderto.innerHTML = '';
                            alert.innerHTML = '';
                            alert.classList.remove('alert');

                            

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

        /* reeDatesFunc(dateBox);

        function freeDatesFunc(datebox){ */

        

        let date = dateBox.attributes.value.value;
        selectedDateStamp = new Date(date);

        selectedDate = dateBox.dataset.date;

        console.log(selectedDate);

        selectedDay = (selectedDateStamp.getDay());
        selectedWorkDay = dolgozoWorkDays[selectedDay];

        ct.innerHTML = '';

        console.log(selectedWorker);
        console.log(selectedDate);

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

                console.log(foglalasok);

                let idopontok = hourBreaker(selectedDate, selectedPause, foglalasok, selectedWorkDay, selectedService.time);


                let items = [] = renderFreeDates(idopontok);

                

                

                items.forEach(item => {
                    item.addEventListener('click', () => {

                        slselec(item);
                        console.log(item.id);

                        selectedTime = item.id;
                    });

                    const dateSuccess = document.querySelector('#date-succ');

                    dateSuccess.addEventListener('click', () => {

                        success(renderto);

                        const succBtn = document.querySelector('#success');

                        const failBtn = document.querySelector('#failed');

                        failBtn.addEventListener('click', () => location.reload())

                        succBtn.addEventListener('click', () => {

            /* ---------------------  validation -------------------------  */


                            const nameInput = document.querySelector('#name').value.trim();
                            const emailInput = document.querySelector('#email').value.trim();
                            const telInput = document.querySelector('#tel').value;

                            const alertBox = document.querySelector('#alert');
                            const nameAlert = document.querySelector('#nameAlert');
                            const emailAlert = document.querySelector('#emailAlert');
                            const telAlert = document.querySelector('#telAlert');

                            validation(nameInput, emailInput, telInput, alertBox, nameAlert, emailAlert, telAlert,selectedTime)
                            
                            
                            

                        })

                    });

                })

            });

        });

});
}

});

})
});
})

.catch(error => console.error('Hiba történt a fetch során:', error));

}







function slselec(el){
    let hls = document.querySelectorAll('.hl')
    hls.forEach(hl => hl.classList.remove('hl'))
    el.classList.add('hl');
    
}







function renderFreeDates(idopontok) {

    const ct = document.querySelector('.date-ct')
    const div = document.createElement('div');
    div.classList.add('list');
    ct.appendChild(div);

    div.innerHTML = '';
    div.innerText = 'Szabad időpontok:'

    const dateSucTpl = `
        <div class="suc-ct">
            <div id="date-succ">Tovább</div>
        </div>
    `
    ct.insertAdjacentHTML('beforeend', dateSucTpl);

    let items = [];

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
        items.push(item)
    }
        return items;
};














function success(renderto) {
    let success = `
        <div class="success">
        <div class="card item">

        <h1>Köszönjük, hogy minket választottál!</h1>
        <h3>Foglalásod megerősítéséhez add meg adataidat:</h3>
        <div class="inp">
        <label for="name">Név:</label><input type="text" id="name" value="sanyi"></input>
        <div id="nameAlert"></div>
        </div>

        <div class="inp">
        <label for="email">Email:</label><input type="email" id="email"  value="sanyi@mail.hu"></input>
        <div id="emailAlert"></div>
        </div>

        <div class="inp">
        <label for="tel">Telefon:</label><input type="tel" id="tel"  value="0612345678"></input>
        <div id="telAlert"></div>
        </div>

        <div class="alert-ct">
        <div class="alert" id="alert"></div>
        </div>

        <button class="button" id="success">Foglalás</button>
        <button class="button" id="failed">Mégsem</button>
        </div>
        </div>
    `;

    renderto.innerHTML = success;
}









function validation(nameInput, emailInput, telInput, alertBox, nameAlert, emailAlert, telAlert, selectedTime){

    nameAlert.innerHTML = "";
    emailAlert.innerHTML = "";
    telAlert.innerHTML = "";



    const validator = {

        errorMessage: 'A mezőt kötelező kitölteni!',

        fields: {
            name: {
                required: true,
                reg: /[\wöüóőúéáűí]{3,}/,
                errorMessage: 'A felhasználó név mező hibásan lett kitöltve!',
                input: nameInput,
                alertbox: nameAlert
            },
            email: {
                required: true,
                reg: /^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                errorMessage: 'Az email mező hibásan lett kitöltve!',
                input: emailInput,
                alertbox: emailAlert
            },
            tel: {
                required: true,
                reg: /^(\+36|06)[0-9]0\d{7}$/,
                errorMessage: 'A telefon mező hibásan lett kitöltve!',
                input: telInput,
                alertbox: telAlert
            },

        },

    };

    let isValid = true;

    for (let field in validator.fields) {
        let data = validator.fields[field];

        console.log(data.reg);
        console.log(data.required);

        if (!data.reg.test(data.input) && data.required
            ||
            !data.reg.test(data.input) && !data.required && data.input.length > 0) {
            console.log('ittabaj');
            data.alertbox.innerHTML = data.errorMessage;
            isValid = false;
        }

        if (data.required && data.input == '') {

            console.log('otta baj');
            data.alertbox.innerHTML = validator.errorMessage;
            isValid = false;

        }

    }

    if (isValid == true) {

        const name = nameInput;
        const email = emailInput;
        const tel = telInput;

        const project = selectedService.project;
        const projectName = selectedService.name;
        
        const duration = selectedService.time;
        const price = selectedService.price;

        fetch('/booking', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name, email, tel, selectedWorker, selectedGen, project, projectName, selectedDate, selectedTime,
                duration,
                price
            })

        })
            .then((res) => res.json())
            .then((message) => {

                

                console.log(message.success);
                renderto.innerHTML = `
<div class="card item alert-ct">

<h1>${message.success}</h1>

<button class="button" id="ok"><a href="/">Bezár</a></button>
</div>`


            });
    }
}