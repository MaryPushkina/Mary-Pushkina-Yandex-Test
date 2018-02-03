const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const graphql = require('./graphql');
const Sequelize = require('sequelize');
const scheme = require('./models/scheme');
const cors = require('cors');
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

const clientDistFolder = path.join(__dirname, '../client/dist');

const app = express();
// app.use(cors());
app.use(bodyParser.json());
// app.all('*', function(req, res, next) {
//   console.log(`Request method is ${JSON.stringify(req.method)}`);
//   console.log(`Request app is ${JSON.stringify(req.app)}`);
//   console.log(`Request base url is ${JSON.stringify(req.baseUrl)}`);
//   console.log(`Request headers is ${JSON.stringify(req.headers)}`);
//   console.log(`Request accepted is ${JSON.stringify(req.accepted)}`);
//   console.log(`Request host is ${JSON.stringify(req.host)}`);
//   console.log(`Request hostname is ${JSON.stringify(req.hostname)}`);
//   console.log(`Request http version is ${JSON.stringify(req.httpVersion)}`);
//   console.log(`Request ip is ${JSON.stringify(req.ip)}`);
//   console.log(`Request ips is ${JSON.stringify(req.ips)}`);
//   console.log(`Request original url is ${JSON.stringify(req.originalUrl)}`);
//   console.log(`Request params is ${JSON.stringify(req.params)}`);
//   console.log(`Request protocol is ${JSON.stringify(req.protocol)}`);
//   console.log(`Request query is ${JSON.stringify(req.query)}`);
//   console.log(`Request url is ${JSON.stringify(req.url)}`);
//   console.log(`Request raw headers is ${JSON.stringify(req.rawHeaders)}`);
//   console.log(`Request raw trailers is ${JSON.stringify(req.rawTrailers)}`);
//   console.log(`Request body is ${JSON.stringify(req.body)}`);
//   next();
// });
app.use('/graphql', graphql(models));
app.use(express.static(clientDistFolder));
app.get('*', function(req, res) {
  res.sendFile(path.join(clientDistFolder, 'index.html'));
})
sequelize
  .sync()
  .then(function()
  {
    app.listen(port, () => console.log('Express app listening on localhost:' + port));
  });
