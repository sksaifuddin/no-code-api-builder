// api.js
import axios from 'axios';

export const getAllAPIUrls = async (userId, tableName) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_NODE_SERVER_IP}/get-api-urls/${userId}/${tableName}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching URLS data:', error);
    throw error;
  }
};
