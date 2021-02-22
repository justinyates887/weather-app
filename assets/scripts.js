let city = $("#searchCity").val();
// store api key
const apiKey = "5c94507bee2830d891aea276d7548d87";

let date = new Date();

$("#searchCity").keypress(function(event) { 
	
	if (event.keyCode === 13) { 
		event.preventDefault();
		$("#search").click(); 
	} 
});

$("#search").on("click", function() {

  $('#forecastHeader').addClass('show');

  city = $("#searchCity").val();
  
  $("#searchCity").val("");  

  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;

  $.ajax({
    url: url,
    method: "GET"
  })
  .then(function (response){

    conditionsCurrent(response);
    forecast(response);
    createList();

    })
  });

  function createList() {
    let li = $("<li>").addClass("list-group-item").text(city);
    $(".list").append(li);
  }

  function conditionsCurrent (response) {

    let temp = (response.main.temp - 273.15) * 1.80 + 32;
    let tempF = Math.floor(temp);

    $('#currentCity').empty();

    const card = $("<div>").addClass("card");
    const cardBody = $("<div>").addClass("card-body");
    const city = $("<h4>").addClass("card-title").text(response.name);
    const date = $("<h4>").addClass("card-title").text(date.toLocaleDateString('en-US'));
    const temperature = $("<p>").addClass("card-text current-temp").text("Temperature: " + tempF + " °F");
    const humidity = $("<p>").addClass("card-text current-humidity").text("Humidity: " + response.main.humidity + "%");
    const wind = $("<p>").addClass("card-text current-wind").text("Wind Speed: " + response.wind.speed + " MPH");
    const image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png")

    city.append(date, image)
    cardBody.append(city, temperature, humidity, wind);
    card.append(cardBody);
    $("#currentCity").append(card)
   
  }

function forecast () {
  
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + apiKey,
    method: "GET"
  }).then(function (response){

    $('#forecast').empty();

    let results = response.list;

    for (let i = 0; i < results.length; i++) {

      let day = Number(results[i].dt_txt.split('-')[2].split(' ')[0]);
      let hour = results[i].dt_txt.split('-')[2].split(' ')[1];

      if(results[i].dt_txt.indexOf("12:00:00") !== -1){
        
        let temp = (results[i].main.temp - 273.15) * 1.80 + 32;
        let tempF = Math.floor(temp);

        const card = $("<div>").addClass("card col-md-2 ml-4 bg-primary text-white");
        const cardBody = $("<div>").addClass("card-body p-3 forecastBody")
        const date = $("<h4>").addClass("card-title").text(date.toLocaleDateString('en-US'));
        const temperature = $("<p>").addClass("card-text forecastTemp").text("Temperature: " + tempF + " °F");
        const humidity = $("<p>").addClass("card-text forecastHumidity").text("Humidity: " + results[i].main.humidity + "%");

        const image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + results[i].weather[0].icon + ".png")

        cardBody.append(date, image, temperature, humidity);
        card.append(cardBody);
        $("#forecast").append(card);

      }
    }
  });

}
