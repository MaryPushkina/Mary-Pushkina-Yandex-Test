const Sequelize = require('sequelize');
const userTable = 'User', roomTable = 'Room', eventTable = 'Event', eventsUsersTable = 'Events_Users';

module.exports = function(sequelize)
{
  const User = sequelize.define(userTable,
  {
    login : Sequelize.STRING,
    homeFloor : Sequelize.TINYINT,
    avatarUrl : Sequelize.STRING
  });

  const Room = sequelize.define(roomTable,
  {
    title : Sequelize.STRING,
    capacity : Sequelize.SMALLINT,
    floor : Sequelize.TINYINT
  });

  const Event = sequelize.define(eventTable,
  {
    title : Sequelize.STRING,
    dateStart : Sequelize.DATE,
    dateEnd : Sequelize.DATE
  });

  Event.belongsToMany(User, {through : eventsUsersTable});
  User.belongsToMany(Event, {through : eventsUsersTable});
  Event.belongsTo(Room);

  return {Room, Event, User};
};
