const connection = require('../config/database');

class model_kategori {

    // Method untuk mendapatkan semua data kategori
    static async getAll(){
        return new Promise((resolve, reject) => {
            connection.query('select id_produk AS id_kategori, nama_kategori from kategori2 order by id_produk desc', (err, rows) => {
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
            connection.query('INSERT INTO kategori2 SET ?', Data, function (err, result) {
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
            connection.query('select id_produk AS id_kategori, nama_kategori from kategori2 where id_produk = ?', [id], (err, rows) =>  {
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
            connection.query('update kategori2 set ? where id_produk = ?', [Data, id], function (err, result) {
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
            connection.query('delete from kategori2 where id_produk = ?', [id], function (err, result) {
                if (err){
                    reject(err);
                }else{
                    resolve(result);
                }
            })
        })
    }

}

module.exports = model_kategori;