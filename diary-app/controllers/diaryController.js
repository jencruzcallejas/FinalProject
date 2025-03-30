import DiaryEntry from "../models/DiaryEntry.js";
import { fetchWeather } from "./weatherController.js";
export const createEntry = async (req, res) => {
    try {
        const { title, content, reflection, tags, location } = req.body;
        // Fetch weather data if location is provided
        const weatherData = location ? await fetchWeather(location) : null;
        const newEntry = new DiaryEntry({
            user: req.user.id, // authentication is added in Part 2
            title,
            content,
            reflection,
            tags,
            location,
            weather: weatherData
        });
        await newEntry.save();
        res.status(201).json(newEntry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};