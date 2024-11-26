//  To detect Mouse
document.addEventListener('DOMContentLoaded', function() { //gpt provided (check last line of js)
    document.getElementById('inputKey').addEventListener('click', function() {
         hideFn(); 
        myWeather();
    });
//To detect Enter key
    document.getElementById('region').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            console.log('Enter key pressed');
            myWeather();
            hideFn();
        }
    });
function hideFn(){
   
  


  respo.style.display =  'block';

      
}
// Main fn
const apiKey = '93fc9451d0e2dcc557e5b5fa9a347db4';

// humidity gauge
var Gauge = window.Gauge;
var humidityGauge = Gauge(document.getElementById("gauge-container"), {
    max: 100,
    // custom label renderer
    label: function(value) {
      return Math.round(value) + "%";
    },
    value: 0,
    // Custom dial colors (Optional)
    color: function(value) {
      if(value < 20) {
        return "blue"; // green
      }else if(value < 40) {
        return "lightblue"; // yellow
      }else if(value < 60) {
        return "yellow"; // orange
      }else {
        return "red"; // red
      }
    }
});
humidityGauge.setValue(0);

// Pressure Gauge
var pressureGauge = Gauge(document.getElementById("gauge-container pressure"), {
    max: 2000,
    // custom label renderer
    label: function(value) {
      return Math.round(value) + "hPa";
    },
    value: 0,
    // Custom dial colors (Optional)
    color: function(value) {
      if(value > 20) {
        return "blue"; // green
      }else {
        return "red"; // red
      }
    }
});
pressureGauge.setValue(0);




function myWeather() {
        const city=document.getElementById("region").value;
        const geocodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}&units=metric`;
        fetch(geocodingUrl)
          .then(response => response.json())
          .then(data => {
            if (data.length > 0) {
              const { lat, lon } = data[0];
              const Latitude = lat;
              console.log(`Latitude: ${lat}, Longitude: ${lon}`);
              place_ll(lat,lon);
              // forMap(lat,lon);
            } else {
              console.log('Place not found');
              alert("Place Not Found Ya")
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });    
}


// To find cordinate Lat and Lon
function place_ll(lat,lon){
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                const weatherContainer = document.getElementById('weatherContainer');
                // const { main, weather } = data;
                const { main, weather, sys } = data;
                const temperature1 = main.temp;
                const pressure = main.pressure;
                const humidity = main.humidity;
                const weatherDescription = weather[0].description;
                const sunrise = sys.sunrise;
                const sunset = sys.sunset;
                const speed =Math.round(data.wind.speed);
                document.getElementById("windSpeed").innerHTML = `<p>Speed: ${speed} <span style="font-size:15px;">Km/hr</span></p>`;
                const degrees=data.wind.deg;
                const gust=Math.round(data.wind.gust);
                document.getElementById("windGust").innerHTML=`<p><svg fill="#ffffff" width="17px" height="17px" viewBox="0 0 32 32" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs> <style> .cls-1 { fill: none; } </style> </defs> <path d="M29.3164,8.0513l-18-6A1,1,0,0,0,10.4,2.2L4,7V2H2V30H4V11l6.4,4.8a1,1,0,0,0,.9165.1489l18-6a1,1,0,0,0,0-1.8974ZM10,13,4.6665,9,10,5Zm4-.0542-2,.667V4.3872l2,.667Zm4-1.333-2,.6665V5.7207l2,.6665Zm2-.667V7.0542L25.8379,9Z" transform="translate(0 0)"></path> <path d="M20,22a4,4,0,0,0-8,0h2a2,2,0,1,1,2,2H8v2h8A4.0045,4.0045,0,0,0,20,22Z" transform="translate(0 0)"></path> <path d="M26,22a4.0045,4.0045,0,0,0-4,4h2a2,2,0,1,1,2,2H12v2H26a4,4,0,0,0,0-8Z" transform="translate(0 0)"></path>  </g></svg>  ${gust} knots</p>`;
                const temperature=Math.round(temperature1);
                // Update Temp & Description
                document.getElementById("temp").innerHTML= `<p> ${temperature} <span>°</span></p>`;
                document.getElementById("description").innerHTML = weatherDescription;
                // call other fn
                window.a=humidity;
                toFindPlace(lat,lon);
                forFiveDays(lat,lon);
                airpolluction(lat,lon);
                getWindDirection(degrees);
                // forMap(lat,lon);
          
                
                // humidityGauge(humidity);
                // pressureGauge(pressure);
                changeBackgroundVideo(weatherDescription,sunrise, sunset);
                // update gauge
                humidityGauge.setValueAnimated(window.a, 1);
                pressureGauge.setValueAnimated(pressure, 1);

            } else {
                alert('City not found');
                document.getElementById("place").innerHTML = ` `;
            }
        })
        .catch(error => {
            console.error('Error fetching the weather data:', error);
        });
}
let mapInstance = null;
//To find Place(name of place)
function toFindPlace(lat,lon){
    const toPlaceUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${apiKey}&units=metric`;
    fetch(toPlaceUrl)
    .then(response => response.json())
    .then(data => {
    if (data.length > 0) {
        const place =data[0];
        window.city = place.name;
        document.getElementById("place").innerHTML = `<p>${city}</p>`;
       
        if (mapInstance) {
          // Reuse the existing map instance
          mapInstance.setView([lat, lon], 13);
          console.log("we "+window.city);
      } else {
          // Initialize the map
          mapInstance = L.map('map').setView([lat, lon], 13);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            color:'red',  
            attribution: ''
          }).addTo(mapInstance);
         
      }
      L.marker([lat, lon]).addTo(mapInstance)
      .bindPopup(window.city)
      .openPopup();
    }
  })     
       
}
//map
// function forMap(lat,lon){
//   var map = L.map('map').setView([lat, lon], 13);
//                 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//                   attribution: ''
//               }).addTo(map);
              
//               var marker = L.marker([lat, lon]).addTo(map);
// }


// function forMap(lat, lon) {
   
//     console.log(window.city);
//   }


// 3 days forecast
function forFiveDays(lat,lon){
     let today = new Date();
    function getDayName(date) {
        const options = { weekday: 'long' };
        return date.toLocaleDateString('en-US', options);
    }
let nextDay = new Date(today);
nextDay.setDate(today.getDate() + 1);
let thirdDay = new Date(today);
thirdDay.setDate(today.getDate() + 2);

    const url= `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetch(url)
    .then(response => response.json())
    .then(data => {
        const baseUrl="https://openweathermap.org/img/wn/"
        const endUrl="@2x.png";
        const forecast = data.list[0];
        const minTemptoday = Math.round(forecast.main.temp_min);
        const maxTempToday =Math.round(forecast.main.temp_max);
        const TweaImg=forecast.weather[0].icon;
        console.log(TweaImg);
        console.log(getDayName(today),"Min" ,minTemptoday ,"Max",maxTempToday);
        document.getElementById("forecast1").innerHTML=`<p>${getDayName(today)} <img src="${baseUrl}${TweaImg}${endUrl}"><span>${minTemptoday}°/${maxTempToday}°</span></p>`;
        // tomorrow data
        const forecastNextDay = data.list[1];
        const minTempNextDay = Math.round(forecastNextDay.main.temp_min);
        const maxTempNextDay =Math.round(forecastNextDay.main.temp_max);
        const ToweaImg=forecastNextDay.weather[0].icon;
        console.log(getDayName(nextDay),"min",minTempNextDay , "max",maxTempNextDay);
        document.getElementById("forecast2").innerHTML=`<p>${getDayName(nextDay)} <img src="${baseUrl}${ToweaImg}${endUrl}"><span>${minTempNextDay}°/${maxTempNextDay}°</span></p>`;
        // Day after Tomorrow
        const forecastThirdDay = data.list[2];
        const minTempThirdDay = Math.round(forecastThirdDay.main.temp_min);
        const maxTempThirdDay =Math.round(forecastThirdDay.main.temp_max);
        const NeweaImg=forecastThirdDay.weather[0].icon;
        console.log(getDayName(thirdDay),"min",minTempThirdDay , "max",maxTempThirdDay);
        document.getElementById("forecast3").innerHTML=`<p>${getDayName(thirdDay)} <img src="${baseUrl}${NeweaImg}${endUrl}"><span>${minTempThirdDay}°/${maxTempThirdDay}°</span></p>`;
 })
}

//Air Quality Index
function airpolluction(lat,lon){
    const url= `http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetch(url)
    .then(response => response.json())
    .then(data => {
        const airData=data.list[0];
        // console.log(airData);
        const aqi=airData.main.aqi;
        console.log(aqi);

        if(aqi==1){
            console.log("Good");
            document.getElementById("aqi").innerHTML=`<p style="background-color:green;"><i class='bx bx-leaf'></i> AQI: Good</p>`;
        }
        else if(aqi==2){
            console.log("Fair");
            document.getElementById("aqi").innerHTML=`<p style="background-color:greenyellow;"><i class='bx bx-leaf'></i> AQI: Fair</p>`;
        }
        else if(aqi==3){
            console.log("Moderate");
            document.getElementById("aqi").innerHTML=`<p style="background-color:yellow;"><i class='bx bx-leaf'></i> AQI: Moderate</p>`;
        }
        else if(aqi==4){
            console.log("Poor");
            document.getElementById("aqi").innerHTML=`<p style="background-color:orange;"><i class='bx bx-leaf'></i> AQI: Poor</p>`;
        }
        else if(aqi==5){
            console.log("Very Poor");
            document.getElementById("aqi").innerHTML=`<p style="background-color:red;"><i class='bx bx-leaf'></i> AQI: Bad</p>`;
        }
    })
}

function getWindDirection(degrees) {
  const directions = [
       "North", "North East", "East", "South East",
        "South", "South West", "West", "North West"
  ];
  
  // Divide 360 degrees into 16 segments
  const index = Math.round(degrees / 45) % 8;
  console.log(directions[index]);
  document.getElementById("windDeg").innerHTML=`<p><svg fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="17px" height="17px" viewBox="0 0 32.743 32.743" xml:space="preserve" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M32.743,0l-12,32.742L18.182,14.56L0,12L32.743,0z"></path> </g> </g></svg> ${directions[index]}</p>`;
}






// function humidityGauge(humidity){
//     console.log("Humidity",humidity);
//     const a= humidity;
//     var gauge;

//     window.onload = function() {
//         var target = document.getElementById('gauge-container');
//         gauge = Gauge(target, {
//             max: 100,
//             dialStartAngle: 135,
//             dialEndAngle: 45,
//             value: a,
//             label: function(value) {
//                 return Math.round(value) + "%";
//             },
//             color: function(value) {
//                 if(value < 20) {
//                     return "#5ee432";
//                 } else if(value < 40) {
//                     return "#fffa50";
//                 } else if(value < 60) {
//                     return "#f7aa38";
//                 } else {
//                     return "#ef4655";
//                 }
//             }
//         });
//     };  //

    
    


//}

// function pressureGauge(pressure){
//     var gauge;
    
//     // window.onload = function() {
//     const a =pressure;
//     var target = document.getElementById('gauge-container pressure');
//     gauge = Gauge(target, {
//         max: 2000,
//         dialStartAngle: 135,
//         dialEndAngle: 45,
//         value: a,
       
//         label: function(value) {
//             return Math.round(value) + " hPa";
//         },
//         color: function(value) {
//             if (value < 50) {
//                 return "red";
//             } 
//              else {
//                 return "blue";
//             }
//         }
//     });
// // }
// }

//Background video Script
function changeBackgroundVideo(weatherDescription,sunrise, sunset) {
    const video = document.getElementById('video-background');
    const currentTime = Math.floor(Date.now() / 1000);
    let videoSrc;

    if (weatherDescription.includes('rain')|| weatherDescription.includes('mist')) {
        videoSrc = 'asset/thunderstrom.mp4';
    } else if (weatherDescription.includes('cloud') || weatherDescription.includes('scattered clouds') || weatherDescription.includes('overcast clouds') || weatherDescription.includes('broken clouds')) {
        if(currentTime >= sunrise && currentTime <sunset){
            videoSrc = 'asset/cloudy.mp4';
        }else{
            videoSrc = 'asset/cloudy-ni.mp4';
        }
    } else if (weatherDescription.includes('sunny') || weatherDescription.includes('clear')) {
        if (currentTime >= sunrise && currentTime < sunset) {
            videoSrc = 'asset/sunny.mp4';
        } else {
            videoSrc = 'asset/clear-ni.mp4';
        }
    } else if (weatherDescription.includes('snow')) {
        videoSrc = 'asset/snow.mp4';
    }else {
        videoSrc = 'path_to_default_video.mp4';
    }

    video.src = videoSrc;
    video.load(); // Reload the video element with the new source
}


});// gpt given bracket see line 1 in js
