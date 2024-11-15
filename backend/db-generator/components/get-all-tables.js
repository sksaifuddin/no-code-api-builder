const { connectToDatabase } = require("../database");

// Function to fetch column details (name and type) for a specific table
const getTableColumns = async (tableName) => {
  const db = await connectToDatabase();
  const query = `
    SELECT column_name AS name, column_type AS type
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE table_name = ?
  `;
  return new Promise((resolve, reject) => {
    db.query(query, [tableName], (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const getAllTables = async (userId) => {
  const db = await connectToDatabase();
  try {
     // Get all tables of the user from the users_databases table
    const userTables = await new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM users_databases WHERE user_id = ?`,
        [userId],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });

    // If there are no tables associated with the user, return an empty object
    if (userTables.length === 0) {
      return { data: [] };
    }

    // Fetch data from each table
    const dataPromises = userTables.map(async (table) => {
      // Fetch column details for the current table
      const columns = await getTableColumns(table.database_name);

      const tableData = await new Promise((resolve, reject) => {
        db.query(`SELECT * FROM ${table.database_name}`, (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        });
      });

      let rows = [];

      // If the table has data, transform the data into rows
      if (tableData.length > 0) {
        rows = tableData.map((row) =>
          Object.entries(row).map(([columnName, value]) => ({
            columnName,
            value,
          }))
        );
      }

      return {
        tableName: table.database_name,
        columns,
        rows,
      };
    });

    // Wait for all the data fetching to complete
    const data = await Promise.all(dataPromises);

    // Return the final object
    return { data };
  } catch (error) {
    console.error("Error fetching tables data:", error);
    throw error;
  }
};

module.exports = {
  getAllTables,
};
