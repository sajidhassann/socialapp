const mysql = require("mysql");
var mysqlConnection = mysql.createConnection({
    host: "db",
    user: "root",
    password: "pass",
    database: process.env.DBNAME || "app",
    multipleStatements: true,
});

mysqlConnection.connect((err) => {
    if (!err) {
        console.log("Connected!");
    }
    else {
        console.log("Connection Failed");
    }
});

module.exports = mysqlConnection;
