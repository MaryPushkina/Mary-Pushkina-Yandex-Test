module.exports = function(models)
{
  const mutationResolvers = 
  {
    // User
    createUser (root, { input }, context)
    {
      return models.User.create(input);
    },

    updateUser (root, { id, input }, context)
    {
      return models.User
        .findById(id)
        .then(user => user.update(input));
    },

    removeUser (root, { id }, context)
    {
      return models.User
        .findById(id)
        .then(user =>
        {
          return user
            .destroy({ force: true })
            .then(() => user);
        });
    },

    // Room
    createRoom (root, { input }, context)
    {
      return models.Room.create(input);
    },

    updateRoom (root, { id, input }, context)
    {
      return models.Room
        .findById(id)
        .then(room => room.update(input));
    },

    removeRoom (root, { id }, context)
    {
      return models.Room
        .findById(id)
        .then(room =>
        {
          return room
            .destroy({ force: true })
            .then(() => room);
        });
    },

    // Event
    createEvent (root, { input, usersIds, roomId }, context)
    {
      return models.Event
        .create(input)
        .then(event =>
        {
          return Promise
            .all([event.setRoom(roomId), event.setUsers(usersIds)])
            .then(() => event);
        });
    },

    updateEvent (root, { id, input }, context)
    {
      return models.Event
        .findById(id)
        .then(event => event.update(input));
    },

    addUserToEvent (root, { id, userId }, context)
    {
      return models.Event
        .findById(id)
        .then(event =>
        {
          return event
            .addUser(userId)
            .then(() => event);
        });
    },

    removeUserFromEvent (root, { id, userId }, context)
    {
      return models.Event
        .findById(id)
        .then(event =>
        {
          return event
            .removeUser(userId)
            .then(() => event);
        });
    },

    changeEventRoom (root, { id, roomId }, context)
    {
      return models.Event
        .findById(id)
        .then(event =>
        {
          return event
            .setRoom(roomId)
            .then(() => event);
        });
    },

    removeEvent (root, { id }, context)
    {
      return models.Event
        .findById(id)
        .then(event =>
        {
          return event
            .destroy({ force: true })
            .then(() => event);
        });
    }
  };
  return mutationResolvers;
};
