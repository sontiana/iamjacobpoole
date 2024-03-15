const daysTag = document.querySelector(".days"),
currentDate = document.querySelector(".current-date"),
prevNextIcon = document.querySelectorAll(".icons span");


let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth();

// kelvin to fahrenheit (K − 273.15) * 9/5 + z
const apiKey = '960a97fbadba14c767203f42005426e7';
const city = 'Los Angeles';
const countryCode = 'US'; 
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&appid=${apiKey}`;

const outputElement = document.getElementById('weather-output');

fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Error');
    }
    return response.json();
  })
  .then(data => {
    const temperatureKelvin = data.main.temp;
    const temperatureFahrenheit = (temperatureKelvin - 273.15) * 9/5 + 32;
    const description = data.weather[0].description;
    const location = data.name;
    outputElement.innerHTML = `<p>Today's Temperature in ${location} is ${temperatureFahrenheit.toFixed(1)}°F</p>
                               <p>Weather: ${description}</p>`;
  })
  .catch(error => {
    outputElement.innerHTML = `<p>Error fetching weather data: ${error.message}</p>`;
  });


const months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];

const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), 
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), 
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), 
    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); 
    let liTag = "";

    for (let i = firstDayofMonth; i > 0; i--) { 
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) { 
    
        let isToday = i === date.getDate() && currMonth === new Date().getMonth() 
                     && currYear === new Date().getFullYear() ? "active" : "";
        liTag += `<li class="${isToday}">${i}</li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) { 
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
    }
    currentDate.innerText = `${months[currMonth]} ${currYear}`; 
    daysTag.innerHTML = liTag;
}
renderCalendar();

prevNextIcon.forEach(icon => { 
    icon.addEventListener("click", () => { 
        
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if(currMonth < 0 || currMonth > 11) { 
            
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear(); 
            currMonth = date.getMonth(); 
        } else {
            date = new Date(); 
        }
        renderCalendar(); 
    });
    
});

const addEvent = (date, title, time, description) => {

    console.log(`Event added on ${date}: ${title} at ${time}. Description: ${description}`);
    const dayElement = document.querySelector(`[data-day="${date.getDate()}"]`);
    if (dayElement) {
        dayElement.classList.add('has-event');
        dayElement.setAttribute('title', `${title}: ${description}`);
    }
};


document.querySelectorAll('.days li').forEach(day => {
    day.addEventListener('click', () => {
        const selectedDate = new Date(currYear, currMonth, parseInt(day.innerText));
        const eventForm = document.querySelector('.event-form');

        
        eventForm.style.display = 'block';

        
        document.getElementById('add-event-btn').addEventListener('click', () => {
            const eventTitle = document.getElementById('event-title').value;
            const eventTime = document.getElementById('event-time').value;
            const eventDescription = document.getElementById('event-description').value;

           
            addEvent(selectedDate, eventTitle, eventTime, eventDescription);

            
            eventForm.style.display = 'none';
        });
    });
});

