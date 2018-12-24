/**
 * Module dependencies.
 */
const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const errorHandler = require('errorhandler');
const compression = require('compression');
const path = require('path');

module.exports = (() => {
  const app = express();

  // All environments.
  app.set('port', process.env.PORT || 3000);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');
  app.use(favicon('public/images/favicon.png'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(methodOverride());
  app.use(compression());
  app.use(express.static(path.join(__dirname, 'public'), { maxage: '7d' }));
  app.use('/bulma', express.static(path.join(__dirname, 'node_modules/bulma/css/'), { maxage: '7d' }));

  app.locals.basedir = path.join(__dirname, 'public');

  app.use(errorHandler());

  return app;
})();
