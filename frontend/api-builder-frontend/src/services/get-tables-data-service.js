// api.js
import axios from 'axios';

export const getAllTablesData = async (userId) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_NODE_SERVER_IP}/get-all-tables/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching tables data:', error);
    throw error;
  }
};
