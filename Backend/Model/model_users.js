const connection = require('../config/database');

class model_users {
    static async getAll() {
        return new Promise((resolve, reject) => {
            connection.query('select * from users order by id_users desc', (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

static async Store(Data) {
    return new Promise((resolve, reject) => {
        connection.query('insert into users set ?', Data, function(err, result){
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    });
}

static async Login(username) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM users WHERE username = ?', [username], function(err, result){
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    });
}

static async getId(id) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM users WHERE id_users = ?', [id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

static async Update(id, Data) {
    return new Promise((resolve, reject) => {
        connection.query('UPDATE users SET ? WHERE id_users = ?', [Data, id], function(err, result){
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    });
}

static async Delete(id) {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM users WHERE id_users = ?', [id], function(err, result){
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    });
}

}

module.exports = model_users;
