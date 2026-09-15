import axios from 'axios';

const API_BASE_URL = '/api';

// Calculator API
export const calculateArbitrage = (itemData) => {
  return axios.post(`${API_BASE_URL}/calculator/calculate`, itemData);
};

export const batchCalculate = (items, keyToRefRate = 63) => {
  return axios.post(`${API_BASE_URL}/calculator/batch`, { items, keyToRefRate });
};

// Items API
export const getItems = () => {
  return axios.get(`${API_BASE_URL}/items`);
};

export const addItem = (itemData) => {
  return axios.post(`${API_BASE_URL}/items`, itemData);
};

export const updateItem = (id, itemData) => {
  return axios.put(`${API_BASE_URL}/items/${id}`, itemData);
};

export const deleteItem = (id) => {
  return axios.delete(`${API_BASE_URL}/items/${id}`);
};

// Health check
export const healthCheck = () => {
  return axios.get(`${API_BASE_URL}/health`);
};