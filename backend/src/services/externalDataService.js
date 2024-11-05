const axios = require('axios');

class ExternalDataService {
  async getWeatherData(location, date) {
    // Υποθετικό API για δεδομένα καιρού
    const response = await axios.get(`https://api.weatherapi.com/v1/history.json?key=${process.env.WEATHER_API_KEY}&q=${location}&dt=${date}`);
    return response.data;
  }

  async getSocialMediaTrends(keyword, date) {
    // Υποθετικό API για τάσεις κοινωνικών μέσων
    const response = await axios.get(`https://api.socialmediatrends.com/v1/trends?key=${process.env.SOCIAL_MEDIA_API_KEY}&keyword=${keyword}&date=${date}`);
    return response.data;
  }

  async getEconomicIndicators(country, date) {
    // Υποθετικό API για οικονομικούς δείκτες
    const response = await axios.get(`https://api.economicindicators.com/v1/indicators?key=${process.env.ECONOMIC_API_KEY}&country=${country}&date=${date}`);
    return response.data;
  }
}

module.exports = new ExternalDataService();
