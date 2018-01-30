const GraphQLDate = require('graphql-date');
const query = require('./query');
const mutation = require('./mutation');

module.exports = function resolvers(models)
{
  const resolvers = 
  {
    Query: query(models),

    Mutation: mutation(models),

    Event:
    {
      users (event)
      {
        return event.getUsers();
      },
      room (event)
      {
        return event.getRoom();
      }
    },

    Date: GraphQLDate
  };
  return resolvers;
};
