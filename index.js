$(document).ready(function () {
    const apiKey = "a25ec5ed353f435e61adde61f64e7303";

    const urlParams = new URLSearchParams(window.location.search);
    const region = urlParams.get('city');
    const state = urlParams.get('state');
    const latitude = urlParams.get('latitude');
    const longitude = urlParams.get('longitude');

    const $regionTitle = $("#regionTitle");
    const $todayTemp = $("#todayTemp");
    const $todayHumidity = $("#todayHumidity");
    const $todayIcon = $("#todayIcon");
    const $description = $("#description");
    const $forecastDays = $("#forecastDays");
    const $weatherContainer = $(".weather-container");
    const $spinner = $("#spinner");

    let apiUrl = "";
    if (latitude && longitude) {
        apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&lang=pt&appid=${apiKey}`;
    } else if (region && state) {
        apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${region},${state},BR&units=metric&lang=pt&appid=${apiKey}`;
    } else if (region) {
        apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${region},BR&units=metric&lang=pt&appid=${apiKey}`;
    } else {
        apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=São Paulo,BR&units=metric&lang=pt&appid=${apiKey}`;
    }

    function fetchWeatherData() {
        $spinner.show();
        $weatherContainer.hide();

        $.getJSON(apiUrl)
            .done(updateWeather)
            .fail((err) => {
                console.error("Erro ao buscar dados da API:", err);
                $weatherContainer.html("<p>Erro ao carregar dados. Tente novamente!</p>");
            })
            .always(() => {
                $spinner.hide();
                $weatherContainer.show();
            });
    }

  function updateWeather(data) {
    const cityName = data.city.name;
    const now = new Date();
    const todayData = data.list.find(item => {
        const itemDate = new Date(item.dt_txt);
        return itemDate.getDate() === now.getDate() && itemDate.getHours() === 12;
    }) || data.list[0];

    let iconCode = todayData.weather[0].icon;
    const hourNow = now.getHours();
    if (iconCode === '01n' && hourNow >= 7 && hourNow <= 18) {
        iconCode = '01d'; 
    }
    $todayIcon.attr("src", getWeatherIconUrl(iconCode));

    const mainWeather = todayData.weather[0].main.toLowerCase();
    const desc = todayData.weather[0].description;
    $regionTitle.text(`Previsão do Tempo - ${cityName}`);
    $todayTemp.text(Math.round(todayData.main.temp));
    $todayHumidity.text(todayData.main.humidity);
    $description.text(capitalize(desc));
    updateBackground(mainWeather);

    $forecastDays.empty();
    const dailyForecasts = data.list.filter((_, i) => i % 8 === 0);

    dailyForecasts.forEach((forecast) => {
        const forecastDate = new Date(forecast.dt_txt);
        let forecastIconCode = forecast.weather[0].icon;

        if (forecastIconCode === '01n' && hourNow >= 7 && hourNow <= 18) {
            forecastIconCode = '01d';
        }

        const date = forecastDate.toLocaleDateString("pt-BR", { weekday: "long" });
        const card = `
            <div class="forecast-card">
                <img src="${getWeatherIconUrl(forecastIconCode)}" alt="Ícone do clima">
                <div>
                    <p><strong>${capitalize(date)}</strong></p>
                    <p>Temp: ${Math.round(forecast.main.temp)}°C</p>
                    <p>Umidade: ${forecast.main.humidity}%</p>
                </div>
            </div>
        `;
        $forecastDays.append(card);
    });
}

    function getWeatherIconUrl(iconCode) {
        return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    }

    function updateBackground(weather) {
        const backgrounds = {
            clear: "sol.jpeg",
            clouds: "nublado.jpg",
            rain: "chuva.jpg",
            snow: "snow.jpg",
            thunderstorm: "thunderstorm.jpg",
            drizzle: "drizzle.jpg",
            mist: "mist.jpg",
        };

        const bgImage = backgrounds[weather] || "default.jpg";

        $("body").css({
            backgroundImage: `url('images/${bgImage}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "background-image 0.5s ease-in-out"
        });
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    fetchWeatherData();
});
