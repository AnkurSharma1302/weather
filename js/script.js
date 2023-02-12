let searchInp = document.querySelector('.weather_search');
let city = document.querySelector('.weather_city');
let day = document.querySelector('.weather_day');
let humidity = document.querySelector('.weather_indicator--humidity>.value');
let wind = document.querySelector('.weather_indicator--wind>.value');
let pressure = document.querySelector('.weather_indicator--pressure>.value');
let image = document.querySelector('.weather_image');
let temperature = document.querySelector('.weather_temperature>.value');
let forecastBlock = document.querySelector('.weather_forecast');
let suggestions = document.querySelector('#suggestions');
let weatherAPIKey = '30820eb35526166b2e04fff0e8c23290';
let weatherBaseEndPoint = "https://api.openweathermap.org/data/2.5/weather?units=metric&appid=" + weatherAPIKey;
let forecastBaseEndPoint = "https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=" + weatherAPIKey;
let cityBaseEndPoint = "https://api.teleport.org/api/cities/?search=";


let d = new Date();



let getWeatherByCityName = async(cityString)=>{
    let city;
    if(cityString.includes(',')){
        city = cityString.substring(0,cityString.indexOf(',')) + cityString.substring(cityString.lastIndexOf(','));
    }
    else{
        city = cityString;
    }
    let endpoint = weatherBaseEndPoint + '&q=' + city;
    let response = await fetch(endpoint);
    if(response.status !== 200){
        alert('City not found!');
        return;
    }
    let weather = await response.json();
    return weather;
}


let weatherForCity = async (city)=>{
    let weather = await getWeatherByCityName(city);
        if(!weather ){
            return;
        }
        
        updateCurrentWeather(weather);
}

let init = () => {
    weatherForCity("New Delhi").then(() => document.body.style.filter = 'blur(0)');
}
init();

searchInp.addEventListener("keydown" , async(e)=>{
    if(e.keyCode === 13){
        weatherForCity(searchInp.value);
    }
   
}
)

searchInp.addEventListener("input" , async() =>{
    let endpoint = cityBaseEndPoint + searchInp.value;
    let result = await(await fetch(endpoint)).json();
    suggestions.innerHTML = '';
    let cities = result._embedded["city:search-results"];
    let length = cities.length > 5? 5: cities.length;
    for(let i = 0 ; i < length ; i++){
        let option = document.createElement("option");
        option.value = cities[i].matching_full_name;
        suggestions.appendChild(option);
    }

})

let updateCurrentWeather = (data)=>{
    city.textContent = data.name + ', ' + data.sys.country;
    day.textContent = dayOfWeek();
    
    console.log(data);
    humidity.textContent = data.main.humidity;
    pressure.textContent = data.main.pressure;
    let windDirection ;
    let deg = data.wind.deg;
    if(deg>45 && deg <= 135){
        windDirection = 'East';
    }
    else if(deg>135 &&deg <= 225){
        windDirection = "South";
    }
    else if(deg>225 &&deg <= 315){
        windDirection = "West";
    }
    else{
        windDirection = "North";
    }
    if(data.weather[0]['id'] >= 200 && data.weather[0]['id'] <= 232){
        image.src = 'images/thunderstorm.png';
    }
    else if(data.weather[0]['id'] >= 300 && data.weather[0]['id'] <= 531){
        image.src = 'images/rain.png';
    }
    else if(data.weather[0]['id'] >= 600 && data.weather[0]['id'] <= 622){
        image.src = 'images/snow.png';
    }
    else if(data.weather[0]['id'] >= 701 && data.weather[0]['id'] <= 781){
        image.src = 'images/mist.png';
    }
    else if(data.weather[0]['id'] >= 801 && data.weather[0]['id'] <= 804){
        image.src = 'images/broken-cloud.png';
    }
    else{
        image.src = 'images/clear-sky.png';
    }
    wind.textContent = windDirection + ", " + data.wind.speed;
    weatherReport(data);
    temperature.textContent = data.main.temp>0 ? '+' + Math.round(data.main.temp) : Math.round(data.main.temp);
}

function weatherReport(data){
    let urlcast = forecastBaseEndPoint + '&q=' + data.name;
    fetch(urlcast).then(res => {
        return res.json()
    }).then((forecast)=>{
        console.log("---")
        console.log(forecast);
        // weatherReport(data);
        dayForecast(forecast);
        
    })
}





function dayForecast(forecast){
    document.querySelector('.weather_forecast').innerHTML = '';

    for(let i = 0 ; i < forecast.list.length; i+=8){
        
        let article = document.createElement('article');
        article.setAttribute('class' , 'weather_forecast_item');

        let din = document.createElement('h3');
        din.setAttribute('class' , 'weather_forecast_day');
        din.innerText = new Date(forecast.list[i].dt*1000).toDateString(undefined,'Asia/Kolkata');
        article.appendChild(din);

        let temp = document.createElement('p');
        temp.innerText = forecast.list[i].main.temp>0 ? '+' + Math.round(forecast.list[i].main.temp) + '°C': Math.round(forecast.list[i].main.temp) + '°C';
        article.appendChild(temp);

        document.querySelector('.weather_forecast').appendChild(article);
    }
}
// console.log(imageId.length);
// console.log(imageId[1]);
// console.log(imageId[2]);
// console.log(imageId[3]);
// if(imageId){
//     for(let i = 0 ; i < imageId.length ; i++){
//         console.log(imageId[i]);
//         console.log('Hello');
    
//         let img = document.createElement('img');
//         img.setAttribute('class' ,'weather_forecast_icon');
        
    
//         if(imageId[i] >= 200 && imageId[i] <= 232){
//             image.src = 'images/thunderstorm.png';
//         }
//         else if(imageId[i] >= 300 && imageId[i] <= 531){
//             img.src = 'images/rain.png';
//         }
//         else if(imageId[i] >= 600 && imageId[i] <= 622){
//             img.src = 'images/snow.png';
//         }
//         else if(imageId[i] >= 701 && imageId[i] <= 781){
//             img.src = 'images/mist.png';
//         }
//         else if(imageId[i] >= 801 && imageId[i] <= 804){
//             img.src = 'images/broken-cloud.png';
//         }
//         else{
//             img.src = 'images/clear-sky.png';
//         }
    
        
//         document.querySelector('.weather_forecast').appendChild(img);
//     }
// }


let dayOfWeek = ()=>{
    var aaj =new Date().toLocaleDateString("en-EN" , {"weekday":"long"});
    
    return aaj;
}



