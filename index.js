const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const pages = require('./pages/routes');
const graphql = require('./graphql');
const Sequelize = require('sequelize');
const scheme = require('./models/scheme');
const port = 3000;

const sequelize = new Sequelize(null, null, null,
{
  dialect : 'sqlite',
  storage : 'db.sqlite3',
  operatorsAliases: { $and: Sequelize.Op.and },
  logging : false
});
scheme(sequelize);
const models = sequelize.models;

const app = express();

app.use(bodyParser.json());
app.use('/', pages);
app.use('/graphql', graphql(models));
app.use(express.static(path.join(__dirname, 'public')));
sequelize
  .sync()
  .then(function()
  {
    app.listen(port, () => console.log('Express app listening on localhost:' + port));
  });
