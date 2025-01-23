document.addEventListener("DOMContentLoaded", () => {
    const apiKey = "a25ec5ed353f435e61adde61f64e7303"; // Substitua por sua chave de API

    const urlParams = new URLSearchParams(window.location.search);
    const region = urlParams.get('city');
    const state = urlParams.get('state');
    const latitude = urlParams.get('latitude');
    const longitude = urlParams.get('longitude');

    let apiUrl = '';

    const regionTitle = document.getElementById("regionTitle");
    const todayTemp = document.getElementById("todayTemp");
    const todayHumidity = document.getElementById("todayHumidity");
    const todayIcon = document.getElementById("todayIcon");
    const description = document.getElementById("description");
    const forecastDays = document.getElementById("forecastDays");
    const weatherContainer = document.querySelector(".weather-container");
    const loaderOverlay = document.querySelector(".loader-overlay");

    if (latitude && longitude) {
        apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&lang=pt&appid=${apiKey}`;
      } else if (region && state) {
        apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${region},${state},BR&units=metric&lang=pt&appid=${apiKey}`;
      } else if (region) {
        apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${region},BR&units=metric&lang=pt&appid=${apiKey}`;
      } else {
        apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=São Paulo,BR&units=metric&lang=pt&appid=${apiKey}`;
      }

    const fetchWeatherData = async () => {
        const spinner = document.getElementById("spinner");
    
        try {
            // Mostra o spinner e esconde o conteúdo
            spinner.style.display = "block";
            weatherContainer.style.display = "none";
    
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Erro ao buscar dados: ${response.statusText}`);
            }
            const data = await response.json();
    
            // Atualiza os dados na tela
            updateWeather(data);
        } catch (error) {
            console.error("Erro ao buscar dados da API:", error);
            weatherContainer.innerHTML = "<p>Erro ao carregar dados. Tente novamente!</p>";
        } finally {
            // Esconde o spinner e mostra o conteúdo
            spinner.style.display = "none";
            weatherContainer.style.display = "block";
        }
    };
    
    const updateWeather = (data) => {
        const cityName = data.city.name;
        regionTitle.textContent = `Previsão do Tempo - ${cityName}`;
        const todayData = data.list[0];
        todayTemp.textContent = Math.round(todayData.main.temp);
        todayHumidity.textContent = todayData.main.humidity;
        todayIcon.src = getWeatherIconUrl(todayData.weather[0].icon);
        description.textContent = todayData.weather[0].description;
        updateBackground(todayData.weather[0].main.toLowerCase());
        console.log(todayData.weather[0].main.toLowerCase())

        forecastDays.innerHTML = "";
        const dailyForecasts = data.list.filter((_, index) => index % 8 === 0);
        dailyForecasts.forEach((forecast) => {
            const date = new Date(forecast.dt_txt).toLocaleDateString("pt-BR", { weekday: "long" });
            const card = document.createElement("div");
            card.className = "forecast-card";
            card.innerHTML = `
                <img src="${getWeatherIconUrl(forecast.weather[0].icon)}" alt="Ícone do clima">
                <div>
                    <p><strong>${date}</strong></p>
                    <p>Temp: ${Math.round(forecast.main.temp)}°C</p>
                    <p>Umidade: ${forecast.main.humidity}%</p>
                </div>
            `;
            forecastDays.appendChild(card);
        });
    };

    const getWeatherIconUrl = (iconCode) => `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const updateBackground = (weatherDescription) => {
        const backgroundImages = {
            "clear": "url('images/sol.jpeg')",
            "clouds": "url('images/nublado.jpg')",
            "rain": "url('images/chuva.jpg')",
            "snow": "url('images/snow.jpg')",
            "thunderstorm": "url('images/thunderstorm.jpg')",
            "drizzle": "url('images/drizzle.jpg')",
            "mist": "url('images/mist.jpg')",
        };

        if (backgroundImages[weatherDescription]) {
            document.body.style.backgroundImage = backgroundImages[weatherDescription];
        } else {
            document.body.style.backgroundImage = "url('images/default.jpg')";
        }
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.transition = "background-image 0.5s ease-in-out";
    };

    fetchWeatherData();
});
