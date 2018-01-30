const expressGraphQL = require('express-graphql');
const { makeExecutableSchema } = require('graphql-tools');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

module.exports = function(models)
{
  const schema = makeExecutableSchema
  ({
    typeDefs,
    resolvers : resolvers(models)
  });

  const expressGraphQLHandler = expressGraphQL
  ({
    schema : schema,
    graphiql : true
  });
  
  return expressGraphQLHandler;
};
