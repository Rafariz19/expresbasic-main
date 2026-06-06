var express = require('express');
var router = express.Router();
const model_produk = require('../Model/model_produk.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('landing', {
        title: 'Landing Page'
    });
});

module.exports = router;
