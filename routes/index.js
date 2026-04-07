var express = require('express');
var router = express.Router();
const model_produk = require('../Model/model_produk.js');

/* GET home page. */
router.get('/', async function(req, res, next) {
    let rows = await model_produk.getAll();

    res.render('Produk/index', {
        title: 'Data Produk',
        data: rows
    });
});

module.exports = router;
