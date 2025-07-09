import axios from 'axios';

const BASE_URL = 'https://web-travel-planner.onrender.com';

export const convertCurrency = async (from, to, amount) => {
  try {
    const response = await axios.get(`${BASE_URL}?from=${from}&to=${to}&amount=${amount}`);
    return response.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const saveConversion = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/save`, data);
    return res.data;
  } catch (err) {
    console.error('Save failed', err);
    return null;
  }
};

export const getSavedConversions = async (userID) => {
  try {
    const res = await axios.get(`${BASE_URL}/saved?userID=${userID}`);
    return res.data;
  } catch (err) {
    console.error('Fetch saved failed', err);
    return [];
  }
};

export const updateConversion = async (id, data) => {
  try {
    const res = await axios.put(`${BASE_URL}/saved/${id}`, data);
    return res.data;
  } catch (err) {
    console.error('Update failed', err);
    return null;
  }
};

export const deleteConversion = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/saved/${id}`);
  } catch (err) {
    console.error('Delete failed', err);
  }
};
