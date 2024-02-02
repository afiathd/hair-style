class Card{

    /* 
    
    renderto
    o = {id, image, name, job, title};

    */

    constructor(renderto, o){
        this.id = o.id;
        this.image = o.image;
        this.name = o.name;
        this.job = o.job;
        this.title = o.title;
        this.working = o.working;
        this.pause = o.pause;
        
        this.renderto = renderto;
        

        this.template = document.createElement('div');
        this.template.classList.add('card-ct');
        this.template.innerHTML = `
            <div class="pic-item"><img src="${this.image}" alt="${this.name}"></div>
            <h3 class="name">${this.name}</h3>
            <h4 class="job">${this.job}</h4>
            <p class="title">${this.title}</p>
            <button id="sub-${this.id}" type="submit">Időpont foglalás</button>
        `;

    }
    
    render() {
        
        this.renderto.appendChild(this.template);
        this.event();
    }

    event() {
        this.submit = document.querySelector(`#sub-${this.id}`);
        return this.submit;
        /* this.submit.addEventListener('click', () => {
            console.log(this.id);
            
        }); */
    }
}