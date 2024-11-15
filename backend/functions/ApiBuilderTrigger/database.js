const mysql = require("mysql");
const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");

// Function to retrieve the database credentials from AWS Secrets Manager
const getSecretsFromManager = async () => {
  const secretsManagerClient = new SecretsManagerClient({
    region: "us-east-1",
  });
  const secretName = "APIBuilderSecret";

  const command = new GetSecretValueCommand({ SecretId: secretName });

  try {
    const data = await secretsManagerClient.send(command);
    if ("SecretString" in data) {
      const secretString = data.SecretString;
      const { user, password, host, database, secretkey } = JSON.parse(secretString);
      return {
        user,
        password,
        host,
        database,
        secretkey
      };
    } else {
      throw new Error("SecretString not found in the response");
    }
  } catch (err) {
    console.error(
      "Error retrieving database credentials from Secrets Manager:",
      err
    );
    throw err;
  }
};

// Function to establish the database connection
const connectToDatabase = async () => {
  const { secretkey, ...dbcredentials } = await getSecretsFromManager();
  const conn = mysql.createConnection(dbcredentials);

  conn.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      throw err;
    }
    console.log("Database is connected successfully !");
  });

  return conn;
};

module.exports = {
  connectToDatabase,
  getSecretsFromManager
};
