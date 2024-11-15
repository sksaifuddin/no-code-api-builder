const { connectToDatabase } = require("../database");

const getAllTablesList = async (userId) => {
    const res = await getTablesFromUserListTable(userId);
    return res;
}

const getTablesFromUserListTable = async (userId) => {
    const db = await connectToDatabase();
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT * FROM users_databases WHERE user_id = ?`,
            [userId],
            (err, rows) => {
              if (err) reject(err);
              resolve(rows.map(({ database_name, ...row }) => (
                {
                    ...row,
                    database_name: getDisplayName(database_name)
                }
              )));
            }
          );
    })
}

const getDisplayName = (tableName) => {
    const indexOfUnderscore = tableName.indexOf('_');
    if (indexOfUnderscore !== -1) {
      return tableName.substring(0, indexOfUnderscore);
    }
    return tableName;
  };

module.exports = {
    getAllTablesList
}