const http = require("http");
const fs = require("fs");
var requests = require('requests');

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceValue = (wow, value) => {
    let temperature = wow.replace("{%tempval%}", value.main.temp);
    temperature = temperature.replace("{%tempMin%}", value.main.temp_min);
    temperature = temperature.replace("{%tempMax%}", value.main.temp_max);
    temperature = temperature.replace("{%state%}", value.name);
    temperature = temperature.replace("{%country%}", value.sys.country);
    temperature = temperature.replace("{%con%}", value.weather[0].main);
    return temperature;
}

//line 17 : we have to stream data chunk by chunk..so we copied the code from the requests website

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests("http://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=d6870c668f6e2c7d2148836b478536f6") 
            .on('data', (chunk) => {
                // console.log(chunk)
                const obj = JSON.parse(chunk);
                //line 25: to create array of objects from the JSON data, const arr = [JSONobject];
                const arrobj = [obj];
                // console.log(arrobj[0].main.temp);
                const newData = arrobj.map((val) => replaceValue(homeFile, val)).join("");
                res.write(newData);
                console.log(newData); 
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
                // console.log('end');
            });
    }
});

server.listen(8000, "127.0.0.1");


// api.openweathermap.org/data/2.5/weather?q=Pune&appid=d6870c668f6e2c7d2148836b478536f6