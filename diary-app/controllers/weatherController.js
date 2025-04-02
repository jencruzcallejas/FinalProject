import axios from "axios";

const API_KEY = "1aa9aefc0ccc827a15c0370e6dbc84e1" 
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";


export const fetchWeather = async (location) => {
    try {
        const [city, countryCode] = location.split(",");
        const response = await axios.get(BASE_URL, {
            params: {
                q: `${city},${countryCode}`,appid: API_KEY,units: "imperial", 
            },
        });

        if (response.status === 200 && response.data) {
            const data = response.data;
            const weatherData = {
                condition: data.weather[0]?.description || null,
                temperature: data.main?.temp || null,
                location: data.name || location,
            };
            
            return weatherData;
        } else {
            return null;
        }
    } catch (error) {
        if (error.response && error.response.status === 400) {
            console.error(`Error: ${error.response.status}: incorrect city or country code.`);
        } else {
            console.error("Error: during fetching weather data.");
        }
        return null;
    }
};