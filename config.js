const express = require("express");
const exphbs = require("express-handlebars");
const favicon = require("serve-favicon");
const sassMiddleware = require("node-sass-middleware");
const compression = require("compression");
const path = require("path");
const PrismicDOM = require("prismic-dom");
const hbsSvg = require("handlebars-helper-svg");

const maxage = process.env.NODE_ENV === "production" ? "1d" : 0;

module.exports = (() => {
  const app = express();
  const hbs = exphbs.create({
    helpers: {
      richTextAsText: function(richText) {
        return PrismicDOM.RichText.asText(richText);
      },
      cookingIcon: function(iconName) {
        return `<svg xmlns="http://www.w3.org/2000/svg">
          <use xlink:href="/images/cooking-icons.svg#${iconName}"></use>
        </svg>`;
      }
    },
    defaultLayout: "main",
    extname: ".hbs",
    partialsDir: "views/partials/"
  });

  app.set("port", process.env.PORT || 8080);

  //app.set("views", path.join(__dirname, "views"));
  //app.set("view engine", "pug");

  app.engine(".hbs", hbs.engine);
  app.set("view engine", ".hbs");
  app.set("views", path.join(__dirname, "views"));

  app.use(favicon("public/images/favicon.png"));
  app.use(
    sassMiddleware({
      src: path.join(__dirname),
      dest: path.join(__dirname, "public"),
      indentedSyntax: true,
      outputStyle: "compressed"
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(compression());
  app.use(express.static(path.join(__dirname, "public"), { maxage }));

  app.locals.basedir = path.join(__dirname, "public");

  return app;
})();
