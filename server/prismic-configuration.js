require("dotenv").config();

// Get the repository from the environment variables.
const repository = process.env.PRISMIC_REPOSITORY || "recipe-box";

module.exports = {
  apiEndpoint: `https://${repository}.prismic.io/api/v2`,

  linkResolver(doc) {
    if (doc.type === "recipe") {
      return `/recipe/${doc.uid}`;
    }

    return "/";
  }
};
