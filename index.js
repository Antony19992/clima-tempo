document.addEventListener("DOMContentLoaded", () => {
    const apiKey = "a25ec5ed353f435e61adde61f64e7303"; // Substitua por sua chave de API

    // Captura o valor do parâmetro 'city' na URL
    const urlParams = new URLSearchParams(window.location.search);
    const region = urlParams.get('city') || "São Paulo"; // Se não houver parâmetro, usa "São Paulo" por padrão

    const regionTitle = document.getElementById("regionTitle");
    const todayTemp = document.getElementById("todayTemp");
    const todayHumidity = document.getElementById("todayHumidity");
    const todayIcon = document.getElementById("todayIcon");
    const description = document.getElementById("description");
    const forecastDays = document.getElementById("forecastDays");
    const weatherContainer = document.querySelector(".weather-container");

    // URL da API
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${region}&units=metric&lang=pt&appid=${apiKey}`;

    const fetchWeatherData = async () => {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Erro ao buscar dados: ${response.statusText}`);
            }
            const data = await response.json();
            updateWeather(data);
        } catch (error) {
            console.error("Erro ao buscar dados da API:", error);
        }
    };

    const updateWeather = (data) => {
        // Atualiza o título com a região
        regionTitle.textContent = `Previsão do Tempo - ${region}`;

        // Dados do clima de hoje
        const todayData = data.list[0]; // Clima atual
        todayTemp.textContent = Math.round(todayData.main.temp);
        todayHumidity.textContent = todayData.main.humidity;
        todayIcon.src = getWeatherIconUrl(todayData.weather[0].icon);
        description.textContent = todayData.weather[0].description;

        // Atualiza o fundo com base no clima
        updateBackground(todayData.weather[0].main.toLowerCase());

        // Previsão dos próximos dias (intervalo de 24h)
        forecastDays.innerHTML = ""; // Limpa previsões existentes
        const dailyForecasts = data.list.filter((_, index) => index % 8 === 0); // Aproximadamente 24h entre previsões
        dailyForecasts.forEach((forecast) => {
            const date = new Date(forecast.dt_txt).toLocaleDateString("pt-BR", {
                weekday: "long",
            });
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

    const getWeatherIconUrl = (iconCode) => {
        return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    };

    const updateBackground = (weatherDescription) => {
        // Mapear descrições de clima para imagens de fundo
        const backgroundImages = {
            "clear": "url('images/sol.jpg')",
            "clouds": "url('images/nublado.jpg')",
            "rain": "url('images/chuva.jpg')",
            "snow": "url('images/snow.jpg')",
            "thunderstorm": "url('images/thunderstorm.jpg')",
            "drizzle": "url('images/drizzle.jpg')",
            "mist": "url('images/mist.jpg')",
        };

        // Atualiza o fundo do body com base no clima
        if (backgroundImages[weatherDescription]) {
            document.body.style.backgroundImage = backgroundImages[weatherDescription];
        } else {
            document.body.style.backgroundImage = "url('images/default.jpg')"; // Fundo padrão
        }

        // Estilização adicional para o efeito
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.transition = "background-image 0.5s ease-in-out";
    };

    // Busca dados ao carregar a página
    fetchWeatherData();
});
