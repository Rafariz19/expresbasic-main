const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'GYV]/4XUS2xZAqGJ',
    database: 'database_express_basic'
});

connection.connect(function(error){
    if (!!error) {
        console.log(error);
    }else{
        console.log('Connection success');
    }
})

module.exports = connection