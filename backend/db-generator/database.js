const mysql = require("mysql");
const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");

// Function to retrieve the database credentials from AWS Secrets Manager
const getSecretsFromManager = async () => {
  const secretsManagerClient = new SecretsManagerClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: "ASIAYA2SN2WRLWXYF6PV",
      secretAccessKey: "ooMKQveefl5TfVvg8F6+gyp9phggZ7YjlS+CMjwQ",
      sessionToken: "FwoGZXIvYXdzEFEaDHgByIX9OfW0Dmn3AiLAAdy6lpUmn2Ea94zFAczGIw9I+dVmRwOCL9qjwVm5MhJoeCu3AQczZqKdb9YznHJrpp+YZy/GaMo+APkKtVJ3hmijk4X1dbnOqyktuyQvB4P9xs6k0PgdJunxxfanHejraPi6esu17ehSolDZan5PuHI95nnxeDJupxhcGnyN+5ZgNDDnPMcIN8CfDIeuy+hHexj0unezk2Hz4Q1NEf23x7FECUEtkAmhf6774tYNn0gCJ5LlOEjwE/KLirlHnc7bWyjQ2KSmBjItyCJF6ummV442eWKuonEi38MpsX7OU3TehcbbI1fJAup6LlCnQBEBS8JRQhCO"
    }
  }); // Replace with your desired region
  const secretName = "APIBuilderSecret"; // Replace with your secret name

  const command = new GetSecretValueCommand({ SecretId: secretName });

  try {
    const data = await secretsManagerClient.send(command);
    if ("SecretString" in data) {
      const secretString = data.SecretString;
      const { user, password, host, database, secretkey, apigateway } = JSON.parse(secretString);
      return {
        user,
        password,
        host,
        database,
        secretkey,
        apigateway
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
