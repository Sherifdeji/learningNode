const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.end("Welcome to my server😊");
  }

  if (req.url === "/users") {
    res.write(`<html>
      <head><title>Dummy User</title></head>
       <body>
       <ul><li>User1</li></ul>
       <ul><li>User2</li></ul>
       <ul><li>User3</li></ul>
       </body> 
     </html> `);
    res.end();
  }
});

server.listen(3000);
