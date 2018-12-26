const Prismic = require('prismic-javascript');
const PrismicDOM = require('prismic-dom');
const PrismicConfig = require('./prismic-configuration');
const app = require('./config');

const PORT = app.get('port');

app.listen(PORT, () => {
  process.stdout.write(`App listening on port ${PORT}\n`);
});

// Middleware to inject prismic context.
app.use((req, res, next) => {
  res.locals.ctx = {
    endpoint: PrismicConfig.apiEndpoint,
    linkResolver: PrismicConfig.linkResolver,
  };

  // Add PrismicDOM in locals to access them in templates.
  res.locals.PrismicDOM = PrismicDOM;

  // Set up prismic api.
  Prismic.api(PrismicConfig.apiEndpoint, {
    accessToken: PrismicConfig.accessToken,
    req,
  }).then((api) => {
    req.prismic = { api };

    // Get the Homepage for access in all templates.
    api.getSingle('homepage')
      .then((document) => {
        res.locals.homepage = document;
        next();
      });
  }).catch((error) => {
    next(error.message);
  });
});

// Home route.
app.route('/').get((req, res) => {
  req.prismic.api.query(
    Prismic.Predicates.at('document.type', 'recipe'),
    { orderings: '[document.first_publication_date desc]' },
  ).then((response) => {
    const recipes = response.results;
    res.render('index', { recipes });
  });
});

// Recipe detail reoute.
app.route('/recipe/:uid').get((req, res) => {
  req.prismic.api.getByUID('recipe', req.params.uid).then((recipe) => {
    res.render('recipe', { recipe });
  });
});

// Search route.
app.route('/search').get((req, res) => {
  const { q } = req.query;
  if (!q) {
    const recipes = [];
    res.render('search', { recipes, q });
    return;
  }

  req.prismic.api.query(
    Prismic.Predicates.fulltext('my.recipe.name', q),
    { page: req.query.page || 1 },
  ).then((response) => {
    const recipes = response.results;
    res.render('search', { recipes, q });
  });
});

// Tag route.
app.route('/tag/:tag').get((req, res) => {
  const { tag } = req.params;
  req.prismic.api.query(
    Prismic.Predicates.at('document.tags', [tag]),
  ).then((response) => {
    const recipes = response.results;
    res.render('tag', { recipes, tag });
  });
});

// Preconfigured prismic preview.
app.get('/preview', (req, res) => {
  const { token } = req.query;
  if (token) {
    req.prismic.api.previewSession(token, PrismicConfig.linkResolver, '/').then((url) => {
      res.redirect(302, url);
    }).catch((err) => {
      res.status(500).send(`Error 500 in preview: ${err.message}`);
    });
  } else {
    res.send(400, 'Missing token from querystring');
  }
});
