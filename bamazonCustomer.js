const mysql = require("mysql");
const prompt = require('prompt');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "garrett",
    database: "bamazon"
});

