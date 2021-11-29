import express from 'express';
import keys from './sources/keys.js';
import fetch from 'node-fetch';
import {engine} from 'express-handlebars';
const app = express()

// Body parser middleware
app.use(express.json());
// middleware to handle the content-type application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// setting template engine
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set('views', './views');


//Get Method 
app.get('/', function (req, res) {
  res.render('index')
})
 
// post city name
app.post('/weather', async (req, res) => {
  const cityName = req.body.cityName;
  if (cityName) {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${keys.API_KEY}`
    );
    const data = await response.json();
    const weather = {
      cityName,
      country: data.sys.country,
      icon: data.weather[0].icon,
      temp: data.main.temp
    }
    res.render('index', { weather });
  } else {
    res.render('index', {error: 'Type the accurate name of the city!'})
  } 
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`The Server Is Running On Port ${PORT}`));