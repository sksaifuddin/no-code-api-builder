import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_NODE_SERVER_IP,
});

export const generateDatabase = async (userId, tableName, columns) => {
  const data = {
    userId,
    dbName: tableName,
    columns: columns.map((column) => ({
      name: column.columnName,
      type: column.columnType,
    })),
  };

  try {
    const response = await api.post('/generate-db', data);
    return response.message;
  } catch (error) {
    console.error('Error generating database:', error);
    throw error;
  }
};
