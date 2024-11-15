const { connectToDatabase, getSecretsFromManager } = require("../database");
const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const sns = new SNSClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: "ASIAYA2SN2WRLWXYF6PV",
    secretAccessKey: "ooMKQveefl5TfVvg8F6+gyp9phggZ7YjlS+CMjwQ",
    sessionToken: "FwoGZXIvYXdzEFEaDHgByIX9OfW0Dmn3AiLAAdy6lpUmn2Ea94zFAczGIw9I+dVmRwOCL9qjwVm5MhJoeCu3AQczZqKdb9YznHJrpp+YZy/GaMo+APkKtVJ3hmijk4X1dbnOqyktuyQvB4P9xs6k0PgdJunxxfanHejraPi6esu17ehSolDZan5PuHI95nnxeDJupxhcGnyN+5ZgNDDnPMcIN8CfDIeuy+hHexj0unezk2Hz4Q1NEf23x7FECUEtkAmhf6774tYNn0gCJ5LlOEjwE/KLirlHnc7bWyjQ2KSmBjItyCJF6ummV442eWKuonEi38MpsX7OU3TehcbbI1fJAup6LlCnQBEBS8JRQhCO"
  }
});

const generateDb = async (userId, dbName, columns) => {
  const res = await createNewUserTable(dbName, columns);
  await insertDBdetails(dbName, userId);
  const { secretkey } =  await getSecretsFromManager();
  const token = generateJWTToken(dbName, userId, secretkey);
  
  await sendEmail(dbName, token);
  return res;
};

const createNewUserTable = async (dbName, columns) => {
  const db = await connectToDatabase();
  return new Promise((resolve, reject) => {
    const columnsWithId = [{ name: "id", type: "VARCHAR" }, ...columns];
    const columnStrings = columnsWithId.map(
      (column) =>
        `${column.name} ${
          column.type === "VARCHAR" ? "VARCHAR(255)" : column.type
        }`
    );
    const sql = `CREATE TABLE ${dbName} (${columnStrings.join(", ")})`;
    db.query(sql, (err, result) => {
      if (err) throw err;
      resolve({
        statusCode: 200,
        body: result,
        message: `${dbName} database created`,
      });
    });
  });
};

const insertDBdetails = async (dbName, userId) => {
  const db = await connectToDatabase();
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO users_databases 
            (database_id, database_name, user_id) 
            VALUES ('${uuid()}', '${dbName}', '${userId}')`,
      (err, res) => {
        if (err) throw err;
        resolve(res);
      }
    );
  });
};

const generateJWTToken = (dbName, userId, secretkey) => {
  const payload = { dbName, userId };
  return jwt.sign(payload, secretkey, { expiresIn: "1h" });
};

const sendEmail = async (dbName, token) => {
  const message = `Your JWT token for ${dbName} is ${token}`;
  const params = {
    Message: message,
    Subject: "New JWT Token",
    TopicArn: "arn:aws:sns:us-east-1:551539299746:ApiBuilderTopic",
    
  };
  
  try {
    await sns.send(new PublishCommand(params));
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = {
  generateDb,
};
