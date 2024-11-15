var response = require("cfn-response");
const { connectToDatabase, getSecretsFromManager } = require("./database");

exports.handler =  async (event, context) => {
  console.log(event);
  var input = parseInt(event.ResourceProperties.Input);
  var responseData = { Value: input * 5 };
  const db = await connectToDatabase();

  const createUserTableQuery =  `CREATE TABLE 'user' (
    'user_id' int NOT NULL,
    'name' varchar(45) DEFAULT NULL,
    'email' varchar(45) DEFAULT NULL,
    'password' varchar(45) NOT NULL,
    PRIMARY KEY ('user_id')
  );`

  db.query(createUserTableQuery);

  const createUserDatabaseTable = `CREATE TABLE 'apibuilder'.'users_databases' (
    'database_id' varchar(255) NOT NULL,
    'database_name' varchar(45) NOT NULL,
    'user_id' varchar(45) NOT NULL,
    PRIMARY KEY ('database_id')
  )`;

  db.query(createUserDatabaseTable)

  response.send(event, context, response.SUCCESS, responseData);
};
