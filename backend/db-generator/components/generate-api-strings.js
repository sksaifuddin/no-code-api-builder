
const { getSecretsFromManager } = require("../database");

const generateApiEndpoint = (apiGatewayUrl, userId, tableName) => {
    // Replace the placeholder values with actual values
    const endpoint = `${apiGatewayUrl}/${userId}/${tableName}`;
    return endpoint;
  };

const generateApiStrings = async (userId, tableName) => {
    const { apigateway: apiGatewayUrl } =  await getSecretsFromManager();
    return {
        data: [
            {
                type: 'GET',
                url: generateApiEndpoint(apiGatewayUrl, userId, tableName)
            },
            {
                type: 'POST',
                url: generateApiEndpoint(apiGatewayUrl, userId, tableName)
            },
            {
                type: 'PUT',
                url: generateApiEndpoint(apiGatewayUrl, userId, tableName)
            },
            {
                type: 'DELETE',
                url: `${generateApiEndpoint(apiGatewayUrl, userId, tableName)}/<id>`
            }
        ]
    }
}

module.exports = {
    generateApiStrings,
};