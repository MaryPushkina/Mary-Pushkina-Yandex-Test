module.exports = function(models)
{
  const queryResolvers = 
  {
    event (root, { id })
    {
      return models.Event.findById(id);
    },
    events (root, args, context)
    {
      return models.Event.findAll({}, context);
    },
    user (root, { id })
    {
      return models.User.findById(id);
    },
    users (root, args, context)
    {
      return models.User.findAll({}, context);
    },
    room (root, { id })
    {
      return models.Room.findById(id);
    },
    rooms (root, args, context)
    {
      return models.Room.findAll({}, context);
    }
  };
  return queryResolvers;
};
