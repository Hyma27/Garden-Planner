import axios from 'axios';

const API_BASE = '/api';

export const api = {
  // Health
  async getHealth() {
    const res = await axios.get(`${API_BASE}/health`);
    return res.data;
  },

  // Plants
  async getPlants(params = {}) {
    const res = await axios.get(`${API_BASE}/plants`, { params });
    return res.data;
  },

  async getPlantById(id) {
    const res = await axios.get(`${API_BASE}/plants/${id}`);
    return res.data;
  },

  // Profile
  async getGardenProfile() {
    const res = await axios.get(`${API_BASE}/garden-profile`);
    return res.data;
  },

  async saveGardenProfile(profileData) {
    const res = await axios.post(`${API_BASE}/garden-profile`, profileData);
    return res.data;
  },

  // Recommendations
  async getRecommendations(payload = {}) {
    const res = await axios.post(`${API_BASE}/recommendations`, payload);
    return res.data;
  },

  // My Garden
  async getGardenPlants() {
    const res = await axios.get(`${API_BASE}/garden`);
    return res.data;
  },

  async addGardenPlant(data) {
    const res = await axios.post(`${API_BASE}/garden/plants`, data);
    return res.data;
  },

  async deleteGardenPlant(id) {
    const res = await axios.delete(`${API_BASE}/garden/plants/${id}`);
    return res.data;
  },

  async updateGardenPlant(id, updates) {
    const res = await axios.patch(`${API_BASE}/garden/plants/${id}`, updates);
    return res.data;
  },

  // Action Tasks
  async getTasks() {
    const res = await axios.get(`${API_BASE}/tasks`);
    return res.data;
  },

  async addTask(task) {
    const res = await axios.post(`${API_BASE}/tasks`, task);
    return res.data;
  },

  async toggleTask(id, completed) {
    const res = await axios.patch(`${API_BASE}/tasks/${id}`, null, {
      params: { completed }
    });
    return res.data;
  },

  // Weather
  async getWeather(city = '') {
    const res = await axios.get(`${API_BASE}/weather`, {
      params: city ? { city } : {}
    });
    return res.data;
  },

  // AI Assistant
  async getAssistantStatus() {
    const res = await axios.get(`${API_BASE}/assistant/status`);
    return res.data;
  },

  async sendChatMessage(message, contextPlantId = null) {
    const res = await axios.post(`${API_BASE}/assistant/chat`, {
      message,
      context_plant_id: contextPlantId
    });
    return res.data;
  }
};
