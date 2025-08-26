const path = require("path");

module.exports = path.dirname(require.main.filename); // this will give us the absolute path to the main file that started the app, which is usually the app.js or server.js file, this is useful for building paths to other files in our project
