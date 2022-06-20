const mysql = require('mysql');
require('dotenv').config({path: '../config/.env'});

const [host, user, password, db] = [process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME];

const connection = mysql.createConnection({
    host: host,
    user:  user,
    password:  password,
    database: db
});

connection.connect((error)=>{
    if(error) throw error;
    console.log('Successfully Connected to DB');
});

module.exports = connection;