async function request(url) {

    try {
        const res = await fetch(url);
        return await res.json();
    
    } catch (error) {
        console.error('Hiba:', error);
        throw error;
    }
   
}


async function fetchService(gen, fetchNAme, renderto) {
    try {
        let services = await request(`http://localhost:3000/${fetchNAme}`);
        renderto = document.querySelector('#content');
        services = services[gen];

        const serviceNames = Object.keys(services);

        serviceNames.forEach( service => {

            const tpl1 = `<div class="service" id="service-${service}">${services[service].name}</div>`;

            renderto.insertAdjacentHTML('beforeend', tpl1);
          
            if(Object.keys(services[service].types).length <= 2){
                const div = document.createElement('div');
                div.classList.add('type');
                div.setAttribute('id', `type-${service}`);
                div.dataset.id = `${service}`;
                const servDiv = document.querySelector(`#service-${service}`);
                servDiv.insertAdjacentElement('beforeend', div);
                div.insertAdjacentText('afterbegin', services[service].name)
                
                const tpl2 = `
                <div class="price" id="${service}-price">
                    <span class='data' data-price='${services[service].types.price}'>Ár: ${services[service].types.price} Ft.</span>
                    <span class='data' data-time='${services[service].types.time}'>időtartam: ${services[service].types.time} perc.</span>
                </div>`;
                
                div.insertAdjacentHTML('beforeend', tpl2);
                div.addEventListener('click', () => event(div));

            }else{
                
                for(const serv in services[service].types){
          
                    const tpl3 = `<div class="type" id="type-${service}-${serv}" data-id="${service}-${serv}">${services[service].types[serv].name}</div>`;

                    const servDiv = document.querySelector(`#service-${service}`);

                    servDiv.insertAdjacentHTML('beforeend',tpl3)

                    const typeDiv = document.querySelector(`#type-${service}-${serv}`);

                    typeDiv.addEventListener('click', () => event(typeDiv));

                    const tpl4 = `
                    <div class="price" id="${service}-price">
                        <span class='data' data-price='${services[service].types[serv].data.price}'>Ár: ${services[service].types[serv].data.price} Ft.</span>
                        <span class='data' data-time='${services[service].types[serv].data.time}'>időtartam: ${services[service].types[serv].data.time} perc.</span>
                    </div>`;
                    
                    typeDiv.insertAdjacentHTML('beforeend', tpl4);


                }

            }
            
            

        });

        const tpl5 = `
            <div class="button-ct service">
                <div class="button" id="submit">Kiválaszt</div>
            </div>`;

        renderto.insertAdjacentHTML('beforeend', tpl5);

        const submit = document.querySelector('#submit');

        submit.addEventListener('click', () => {

            const alert = document.querySelector('#alert');

           
                return selectedService;
            
            
            
            
        });



    } catch (error) {
        console.error('Hiba:', error);
        throw error;
    }

    function event(el){
        let hls = document.querySelectorAll('.hl')
        hls.forEach(hl => hl.classList.remove('hl'))
        el.classList.add('hl');
        selectedService = ({
            project: el.dataset.id,
            name: el.closest('.service').firstChild.data +'-' + el.firstChild.data,
            time: el.firstElementChild.lastElementChild.dataset.time,
            price: el.firstElementChild.firstElementChild.dataset.price
        });

        
        
    }

   
} 