class Calendar {
    constructor(renderto,weeks) {
        this.renderto = document.querySelector(renderto);
        this.now = new Date();
        this.currentDate = new Date();
        this.dates = [];
        this.weeks = weeks;    

    }

    setFullYear(num) {
        this.currentDate.setFullYear(num);
        this.currDates();
    }

    setMonth(num) {
        this.currentDate.setMonth(num);
        this.currDates();
    }

    setDate(num) {
        this.currentDate.setDate(num);
        this.currDates();
    }

    getCurrentYear() {
        return this.currentDate.getFullYear();
    }

    getCurrentMonth() {
        return this.currentDate.getMonth();
    }

    getTolocalDatetsr() {
        return this.currentDate.toLocaleDateString().replaceAll('. ', '-').slice(0,-1);
    }

    getCurrentMonthName() {
        return this.months[this.currentDate.getMonth()];
    }

    getCurrentDate() {
        return this.currentDate.getDate();
    }

    getCurrentDay() {
        return this.currentDate.getDay();
    }

    getToday() {
        return new Date().getDate();
    }

    getFirstDayOfMonth() {
        let firstDay = new Date(this.getCurrentYear(), this.getCurrentMonth(), 1).getDay();

        const days = {
            1: 1,
            2: 2,
            3: 3,
            4: 4,
            5: 5,
            6: 6,
            0: 7
        };

        return days[firstDay];
    }

    getLastDateOfMonth() {
        return new Date(this.getCurrentYear(), this.getCurrentMonth() + 1, 0).getDate();
    }

    getLastDateOfPrevMonth() {
        return new Date(this.getCurrentYear(), this.getCurrentMonth(), 0).getDate();
    }

    currDates() {


        this.dates = [];

        /*  hónapot megelőző napok, ha vannak  */

        if (this.getFirstDayOfMonth() != 1) {
            let prevDays = this.getFirstDayOfMonth() - 1;
            for (prevDays; prevDays >= 1; prevDays--) {
                this.dates.push({
                    status: 'inactive',
                    year: this.getCurrentYear(),
                    month: this.getCurrentMonth()-1,
                    day: this.getLastDateOfPrevMonth() - prevDays + 1,
                    datasetDate: this.getTolocalDatetsr()
                });
            }

        }

        /* napok a mai napig */

        for (let i = 1; i < this.getToday(); i++) {
            this.dates.push({
                status: 'inactive',
                year: this.getCurrentYear(),
                month: this.getCurrentMonth(),
                day: i,
                datasetDate: this.getTolocalDatetsr()
            });
        }

        /* mai nap */

        if (this.currentDate.toLocaleDateString() < this.now.toLocaleDateString()) {
            this.dates.push({
                status: 'inactive',
                year: this.getCurrentYear(),
                month: this.getCurrentMonth(),
                day: this.getToday(),
                datasetDate: this.getTolocalDatetsr()
            });
        } else if (this.currentDate.toLocaleDateString() == this.now.toLocaleDateString()) {
            this.dates.push({
                status: 'active',
                status2: 'today',
                year: this.getCurrentYear(),
                month: this.getCurrentMonth(),
                day: this.getToday(),
                datasetDate: this.getTolocalDatetsr()
            });
        } else if (this.currentDate.toLocaleDateString() > this.now.toLocaleDateString()) {
            this.dates.push({
                status: 'active',
                year: this.getCurrentYear(),
                month: this.getCurrentMonth(),
                day: this.getToday(),
                datasetDate: this.getTolocalDatetsr()
            });
        }

        /* napok a mai naptól a hónap végéig */

        for (let i = this.getToday() + 1; i <= this.getLastDateOfMonth(); i++) {
            this.dates.push({
                status: 'active',
                year: this.getCurrentYear(),
                month: this.getCurrentMonth(),
                day: i,
                datasetDate: this.getTolocalDatetsr()
            });
        }

        /* következő hónap napjai, ha szükséges */

        for (let i = 1; this.dates.length < 7 * this.weeks; i++) {
            this.dates.push({
                status: 'active',
                year: this.getCurrentYear(),
                month: this.getCurrentMonth()+1,
                day: i,
                datasetDate: this.getTolocalDatetsr()
            });
        }

        /* dátumok aktív vagy inaktív a mai naphoz képest */

        this.dates.forEach(date => {
            const currentDate = new Date(date.year, date.month, date.day);
            if (currentDate.toLocaleDateString() < this.now.toLocaleDateString()) {

                date.status = 'inactive';

            } else if (currentDate.toLocaleDateString() > this.now.toLocaleDateString()) {

                date.status = 'active';
                
            }
        });

        /* hétvége inaktív */

        this.dates.forEach(date => {
            const dayOfWeek = new Date(date.year, date.month, date.day).getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                date.status = 'inactive';
            }
        });

        return this.dates;
    }

    render() {
        this.currDates();

        this.months = {
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

        this.template = `
            <div class="cal-ct">
                <div class="nav">
                    <div class="prev"><svg xmlns="http://www.w3.org/2000/svg" height="16" width="16"
                            viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                            <path
                                d="M459.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4L288 214.3V256v41.7L459.5 440.6zM256 352V256 128 96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160C4.2 237.5 0 246.5 0 256s4.2 18.5 11.5 24.6l192 160c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V352z" />
                        </svg></div>
                    <div class="month">${ this.getCurrentYear()+'    '+this.getCurrentMonthName()}</div>
                    <div class="next"><svg xmlns="http://www.w3.org/2000/svg" height="16" width="16"
                            viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                            <path
                                d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4L224 214.3V256v41.7L52.5 440.6zM256 352V256 128 96c0-12.4 7.2-23.7 18.4-29s24.5-3.6 34.1 4.4l192 160c7.3 6.1 11.5 15.1 11.5 24.6s-4.2 18.5-11.5 24.6l-192 160c-9.5 7.9-22.8 9.7-34.1 4.4s-18.4-16.6-18.4-29V352z" />
                        </svg></div>
                </div>
                <div class="days">
                    <div class="day box">Hétfő</div>
                    <div class="day box">Kedd</div>
                    <div class="day box">Szerda</div>
                    <div class="day box">Csütörtök</div>
                    <div class="day box">Péntek</div>
                    <div class="day box">Szombat</div>
                    <div class="day box">Vasárnap</div>
                </div>
                <div class="cal">      
                </div>
            </div>`;


        this.renderto.innerHTML = '';

        this.renderto.insertAdjacentHTML('beforeend', this.template);

        const calParent = document.querySelector('.cal');
        let index = 0;
        let i = 0;

        this.currDates().forEach((date, index) => {
            if (index % 7 == 0) {
                i++;
                let calRow = document.createElement('div');
                calRow.className = `cal-row row-${i}`;
                calParent.appendChild(calRow);
            }
            let rowNum = document.querySelector(`.row-${i}`);
            const dateBox = document.createElement('div');
            let actualDate = date.year+'-'+(date.month+1)+'-'+date.day;

            rowNum.appendChild(dateBox);

            dateBox.className = 'date box';
            dateBox.classList.add(date.status);
            dateBox.textContent = date.day;
            dateBox.setAttribute('value', actualDate);
            dateBox.dataset.date = date.datasetDate;

            if (date.year == this.getCurrentYear()
                && date.month == this.getCurrentMonth()
                && date.day == this.getToday()
                && date.status2 == 'today') {
                dateBox.classList.add(date.status);
                dateBox.classList.add(date.status2);
            }

            this.element = document.querySelectorAll('.active');
        });
        /* hónapok előre - hátra gombok */
        this.prev = document.querySelector('.prev');
        this.next = document.querySelector('.next');
        this.prev.addEventListener('click', () => {
            this.prevMonth();
            console.info('prev');
        });
        this.next.addEventListener('click', () => {
            this.nextMonth();
            console.info('next');
        });
    }

    nextMonth = () => {
        this.setMonth(this.getCurrentMonth() + 1);
        this.render();
    };

    prevMonth = () => {
        this.setMonth(this.getCurrentMonth() - 1);
        this.render();
    };

    event() {
        
        return this.element;

    }

}
