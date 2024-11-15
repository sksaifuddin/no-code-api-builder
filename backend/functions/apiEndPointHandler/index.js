const { connectToDatabase, getSecretsFromManager } = require("./database");
const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");

exports.handler = async (event) => {
  console.log("event", event);
  const { authorization } = event.headers;
  const { method, path } = event.requestContext.http;
  let { body } = event;
  // const res =  await testConnection();
  const { secretkey } = await getSecretsFromManager();
  try {
    const decodedToken = verifyToken(authorization, secretkey);
    console.log("Decoded Token:", decodedToken);
    const { user, tableName, recordId } = getTableNameAndUserFromPath(path);
    const userTableName = `${tableName}_${user}`;
    const db = await connectToDatabase();
    let res;
    switch (method) {
      case "POST": {
        res = await postApiHandler(body, userTableName, db);
        break;
      }
      case "GET": {
        console.log("in get");
        res = await getApiHandler(userTableName, db);
        break;
      }
      case "PUT": {
        console.log("in put");
        res = await putApiHandler(body, userTableName, db);
        break;
      }
      case "DELETE": {
        console.log("in delete");
        res = await deleteApiHandler(userTableName, recordId, db);
        break;
      }
    }
    console.log("res", JSON.parse(JSON.stringify(res)));
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        data: JSON.parse(JSON.stringify(res)),
      }),
    };
    return response;
  } catch (error) {
    console.error("Error verifying token:", error);
    const response = {
      statusCode: 401,
      body: JSON.stringify({
        message: "Invalid token",
      }),
    };
    return response;
  }
};

const getTableNameAndUserFromPath = (path) => {
  const [_, _stageName, id, tableName, recordId] = path.split("/");
  return { user: id, tableName, recordId };
};

const postApiHandler = (body, tableName, db) => {
  return new Promise((resolve, reject) => {
    const requestData = JSON.parse(body);
    requestData.id = uuid();
    const sqlQuery = `INSERT INTO ${tableName} (${Object.keys(requestData).join(
      ", "
    )}) VALUES (${Object.values(requestData)
      .map((value) => (typeof value === "string" ? `'${value}'` : value))
      .join(", ")})`;
    console.log("sql query", sqlQuery);
    db.query(sqlQuery, (err, result) => {
      if (err) {
        reject(err);
      }
      console.log("result-->", result);
      resolve(result);
    });
  });
};

const getApiHandler = (tableName, db) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = `SELECT * FROM ${tableName}`;
    db.query(sqlQuery, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

const putApiHandler = (body, tableName, db) => {
  return new Promise((resolve, reject) => {
    const requestData = JSON.parse(body);
    if (!requestData.id) {
      reject("Please provide id which needs update");
    }

    const { id: recordId, ...clauseData } = requestData;
    const setClause = Object.keys(clauseData)
      .map(
        (key) =>
          `${key} = ${
            typeof requestData[key] === "string"
              ? `'${requestData[key]}'`
              : requestData[key]
          }`
      )
      .join(", ");

    const sqlQuery = `UPDATE ${tableName} SET ${setClause} WHERE id = '${recordId}'`;
    db.query(sqlQuery, (err, result) => {
      if (err) {
        reject(err);
      }
      console.log("result-->", result);
      resolve(result);
    });
  });
};

const deleteApiHandler = (tableName, recordId, db) => {
  return new Promise((resolve, reject) => {
    if (!recordId) {
      reject("Please provide id which needs update");
    }
    const sqlQuery = `DELETE FROM ${tableName} WHERE id = '${recordId}'`;
    console.log("sql query", sqlQuery);
    db.query(sqlQuery, (err, result) => {
      if (err) {
        reject(err);
      }
      console.log("result-->", result);
      resolve(result);
    });
  });
};

const verifyToken = (token, secretkey) => {
  try {
    return jwt.verify(token, secretkey);
  } catch (error) {
    throw new Error("Invalid token");
  }
};
