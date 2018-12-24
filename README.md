# Recipe Box

>  Recipe app with content managed in [Prismic](https://prismic.io/) headless API CMS.

## Requirements

- Node.js v11+
- npm v6+

## How to launch this project in your local environment

First clone this repo:

```bash
git clone https://github.com/mattsimonis/recipe-box.git
cd recipe-box
```

Then run the following commands:

``` bash
npm install
npm run dev
```

Then you can access it at [http://localhost:3000](http://localhost:3000).

## Prismic Configuration

This repository is linked to the recipe-box Primic instance. To create your own repository, you'll need to follow these steps. This will walk you through creating your repository and the custom content types necessary for the app.

- Create an account on [Prismic](https://prismic.io/).
- From your [dashboard](https://prismic.io/dashboard/), create a new repository. Keep note of the name.
- Open your repository, and go to Custom types.
- Create a new custom type, of type single type, called Homepage.
- In the JSON editor, paste the contents from [Homepage.json](Prismic/Homepage.json) and save.
- Create a new custom type, of type repeatable type, called Recipe.
- In the JSON editor, paste the contents from [Recipe.json](Prismic/Recipe.json) and save.

## Prismic Content

Now you have your repository to store your content, and the content types to power the homepage and recipe pages.

Next you'll want to go to Content, and create a Homepage.

Once you have your homepage, you can begin adding recipes which will appear in your app.

## App Configuration

To connect the node app to your repository, you'll have to edit `prismic-configuration.js`.

```javascript
apiEndpoint: 'https://your-repository-name.prismic.io/api/v2',
```