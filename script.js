require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/", function(req,res){
    res.render("result");
});

app.post("/", function(req,res){
    var location=req.body.Place;
    
    if(location.length===0){
        res.redirect("/");
        return;
    }

    const apiKey=process.env.API_KEY;
    const url="https://api.openweathermap.org/data/2.5/weather?q="+ location+"&appid="+apiKey+"&units=metric";

    https.get(url, function(response){
        
        response.on("data", function(data){
            const weather=JSON.parse(data);

            if (weather.cod !== 200) {
                res.render("error");
                return;
            }
            
            const tem=Math.round(weather.main.temp);
            const desc=weather.weather[0].description;
            const icn=weather.weather[0].icon;
            const feels=weather.main.feels_like;
            const humid=weather.main.humidity;    // %
            const prs=weather.main.pressure;   // hPa
            const wsp=weather.wind.speed;   // mph
            const imgs="https://openweathermap.org/img/wn/"+ icn +"@2x.png";


            res.render("final",{ lc: location, wth: tem, des: desc, icon: imgs, feelsLike: feels, humidity: humid, pressure: prs, windSpeed: wsp});
        });
    });
    
});

app.post("/home", function(req,res){
    res.redirect("/");
});

app.post("/error", function(req,res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("server is running on port 3000 !!");
});