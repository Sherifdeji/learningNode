const mysql = require("mysql2");

// There are 2 ways of connecting to a mysql database
// 1. Creating a connection: this will create a single connection to the database but it will not be reused and will be closed after the query is executed and we have re-execute the code to create a new connection for the next query which is inefficient.

// 2. a better way is creating a connection pool: this will create a pool of connections that can be reused, it will always allow use to reach out to it whenever we have a query to run

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Sherif",
  database: "sys",
});

module.exports = pool.promise();
