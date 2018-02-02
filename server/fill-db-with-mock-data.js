const Sequelize = require('sequelize');
const scheme = require('./models/scheme');
const { createMockData } = require('./test/create-mock-data');

const sequelize = new Sequelize(null, null, null,
{
  dialect : 'sqlite',
  storage : 'db.sqlite3',
  operatorsAliases: { $and: Sequelize.Op.and },
  logging : false
});
scheme(sequelize);
const models = sequelize.models;
sequelize
  .sync({ force: true })
  .then(() => createMockData(models))
  .then(() => console.log("Filled database with mock data"));
