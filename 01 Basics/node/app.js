const http = require("http"); //to import files or global modules in node; a path to your own files should start with ./(a relative path ie a local path)
const routes = require("./route");

const server = http.createServer(routes);

server.listen(3000);
