import axios from 'axios';

export const getAllTablesList = async (userId) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_NODE_SERVER_IP}/get-all-tables-list/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tables data:', error);
    throw error;
  }
};
