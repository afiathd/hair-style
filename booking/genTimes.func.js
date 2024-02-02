function generateTimes(date, worktime, duration){

    let [startTime, endTime] = worktime.split('-');

    startTime = new Date(date + ' ' + startTime);
    endTime = new Date(date + ' ' + endTime);
    
    let controlDate = timeModifier(endTime,`-${duration}`);
    
    controlDate = new Date(date + ' ' + controlDate);

    let generatedTimes = [];

    while(startTime <= controlDate){

        let time = startTime.toLocaleTimeString();
        let toTime = new Date(startTime.getTime() + duration * 60 * 1000).toTimeString().split(' ')[0];
        
        generatedTimes.push(time + '-' + toTime)

        startTime.setTime(startTime.getTime() + duration * 60 * 1000);
    }
   
    return generatedTimes;
}


function hourBreaker(date, pause, booked, workTime, servTime){

    let freeDates = [];

    let breakers = merge(booked, pause);


    breakers.sort((a, b) => {
        const timeA = new Date("2000-01-01 " + a.split("-")[0]);
        const timeB = new Date("2000-01-01 " + b.split("-")[0]);
        return timeA - timeB;
    });

    
    let [startTime,endTime] = workTime.split('-');
   

    breakers.forEach(breaker => {
        const breakArr = breaker.split('-');
        

        if(startTime == breakArr[0]){

            startTime = breakArr[1];

        }else{

            let controlDate = new Date("2000-01-01 "+startTime);
            if(controlDate.setMinutes(servTime) <= new Date("2000-01-01 "+breakArr[0]) ){
                let varWorktime = startTime+'-'+breakArr[0];

                freeDates = merge(freeDates, generateTimes(date, varWorktime, servTime));

                
                startTime = breakArr[1];
            }

            

        }

        
    });

    let varWorktime = startTime+'-'+endTime;

    freeDates = merge(freeDates, generateTimes(date, varWorktime, servTime));


    return freeDates;
}



function merge(a,b){

    let result = [...a];

    for(let element of b){
        if(!result.includes(element)){
            result.push(element);
        }
    }

    return result;

}



function timeModifier(appointment, minutes) {
    let time = new Date(appointment);
    time.setMinutes(time.getMinutes() + parseInt(minutes));
    
    return time.toLocaleTimeString();
}
