const connection = require('../config/database');

class model_produk {

    static async getAll(){
        return new Promise((resolve, reject) => {
            connection.query('select * from produk order by id_produk desc', (err, rows) => {
                if (err){
                    reject(err);
                }else{
                    resolve(rows);
                }
            })
        })
    }

    static async Store(Data){
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO produk SET ?', Data, function (err, result) {
                if (err){
                    reject(err);
                }else{
                    resolve(result);
                }
            })
        })
    }

    static async getid(id){
        return new Promise((resolve, reject) => {
            connection.query('select * from produk where id_produk = ' + id, (err, rows) =>  {
                if (err){
                    reject(err);
                }else{
                    resolve(rows);
                }
            })
        })
    }

    static async update(id, Data){
        return new Promise((resolve, reject) => {
            connection.query('update produk set ? where id_produk = '+ id, Data, function (err, result) {
                if (err){
                    reject(err);
                }else{
                    resolve(result);
                }
            })
        })
    }

    static async delete(id){
        return new Promise((resolve, reject) => {
            connection.query('delete from produk where id_produk = '+ id, function (err, result) {
                if (err){
                    reject(err);
                }else{
                    resolve(result);
                }
            })
        })
    }

}

module.exports = model_produk;