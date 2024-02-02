const express = require('express');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const { JSONModifier } = require('./jsonmodifier');
const { log } = require('console');

dotenv.config();

const jsonDolgozok = new JSONModifier(path.join(__dirname, 'dolgozok.json'));
const jsonNevnapok = new JSONModifier(path.join(__dirname, 'nevnapok.json'));
const jsonServices = new JSONModifier(path.join(__dirname, 'services.json'));
const jsonIdopontok = new JSONModifier(path.join(__dirname, 'idopontok.json'));
const jsonUsers = new JSONModifier(path.join(__dirname, 'users.json'));

const app = express();

function auth(req, res, next){

    const token = req.cookies.auth_token;

    if (!token)
        return res.status(200).sendFile(__dirname + '/view/login.html');

    jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
        if (err)
            return res.status(200).sendFile(__dirname + '/view/login.html');

        res.response = {success: true};
        next();
    });

}

app.use(cookieParser());
app.use(express.json());

app.use( express.static(path.join(__dirname, 'public')));
app.use(['/booking', '/cards'] ,express.static(path.join(__dirname, 'booking')));
app.use(['/booking/assets', '/cards'] ,express.static(path.join(__dirname, 'assets')));
app.use(['/login', '/dashboard'] ,express.static(path.join(__dirname, 'view')));


app.get('/', (req, res) => {
    res.status(200).sendFile(__dirname + '/public/index.html');
});

app.get('/booking', (req, res) => {
    res.status(200).sendFile(__dirname + '/booking/page.html');
    
});

app.get('/cards', (req, res) => {

    jsonDolgozok.read()
        .then( workers => res.json(workers) );
    
});

app.get('/services', (req, res) => {
    
    jsonServices.read()
        .then( services => res.json(services) );
})


app.get('/appointment/:id', (req, res) => {

    jsonDolgozok.getById(req.params.id)
        .then( dolgozo => res.json(dolgozo));

})


app.get('/nevnapok', (req, res) => {
    
    jsonNevnapok.read()
        .then( nevnapok => res.json(nevnapok) );

})

app.post('/booked', async (req, res) => {
    
    let bookedArr = [] ;

    await jsonIdopontok.filter(idopont => {

        if (idopont.selectedWorker == req.body.selectedWorker && idopont.selectedDate == req.body.selectedDate) {
            
            bookedArr.push(idopont.selectedTime);
        };

    });

    res.status(200).json(bookedArr);
});


app.post('/booking', (req, res) => {
    jsonIdopontok.insert(req.body);
    res.status(200).json({success: 'Sikeres időpontfoglalás'})
});


/* ------------------- ADMIN FELÜLET ----------------- */


app.get('/dashboard', auth, (req, res) => {
    res.status(200).sendFile(__dirname + '/view/dashboard.html');
});


app.post('/login', async (req, res) => {
    const user = await jsonUsers.find( user => user.name == req.body.name);

    if (!user)
        return res.status(404).json({msg: "Rossz azonosító név.", logged: false});

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword)
        return res.status(404).json({msg: "hibás jelszó", logged: false});

    const tokenPayLoad = {
        username: user.name
    };

    const accessToken = jwt.sign(tokenPayLoad, process.env.SECRET_KEY);

    const now = new Date();
    now.setMinutes(now.getMinutes() + parseInt(process.env.USER_ACCESS_MINUTES));

    res.cookie("auth_token", accessToken, {
        path: '/', 
        expires: now, 
        httpOnly: true
    });

    res.status(200).json({logged: true});
});

app.get('/booked/:date', async (req, res) => {

    console.log(req.params.date);
    
    let bookedArr = [] ;

    await jsonIdopontok.filter(foglalas => {

        if (foglalas.selectedDate == req.params.date) {
            
            bookedArr.push(foglalas);
            console.log(foglalas);
        };

    });

    res.status(200).json(bookedArr); 
});


app.get('/logout', (req, res) => {
    res.clearCookie("auth_token");
    res.redirect('/');
})


app.listen(process.env.PORT, () => {
    console.log(`app runing in port: ${process.env.PORT}`);
});