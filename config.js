const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const compression = require('compression');
const path = require('path');

module.exports = (() => {
  const app = express();

  app.set('port', process.env.PORT || 3000);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');
  app.use(favicon('public/images/favicon.png'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(compression());
  app.use(express.static(path.join(__dirname, 'public'), { maxage: '7d' }));
  app.use('/bulma', express.static(path.join(__dirname, 'node_modules/bulma/css/'), { maxage: '7d' }));

  app.locals.basedir = path.join(__dirname, 'public');

  return app;
})();
