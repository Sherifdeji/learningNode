const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Enter Message</title></head>");
    res.write(
      "<body><form action='/message' method='POST'><input type='text' name='message'><button type='submit'>Send</button></form></body>"
    );
    res.write("</html>");
    return res.end(); // we are returning here which is not required, but we are doing it here so it will stop the function execution when its done, we have to do this cos after res end we must not call other res whatever and we dont want what is below to run to avoid error so you should avoid double res.end() in your code.
  }

  if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      fs.writeFile("message.txt", message, (err) => {
        res.statusCode = 302; //redirection
        res.setHeader("Location", "/"); // This instructs the browser to redirect the user to the root path ("/").
        return res.end();
      });
    });
  }
  //   console.log(req.url, req.method, req.headers);
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>Enter Message</title></head>");
  res.write("<body><h1>Hello from my node.js server</h1></body>");
  res.write("</html");
  res.end(); //you cant change the res. after ending it
  // the arrow function is our request listener function, which runs for every request that reaches our server
};

module.exports = requestHandler;
