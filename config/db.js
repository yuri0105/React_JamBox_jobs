// DataBase 
var mysql = require("mysql");

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "newpass",
    database: "jambox",
});

con.connect(function (err) {
    if (err) {
        console.log('Database connecting error', err);
        return;
    }
    console.log('Database connecting success');
});

module.exports = con;