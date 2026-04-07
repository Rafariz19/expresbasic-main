var express = require('express');
var router = express.Router();
const connection = require("../config/database.js");
const model_produk = require('../Model/model_produk.js');

router.get('/', async function(req, res, next) {
    let rows = await model_produk.getAll();

    res.render('Produk/index', {
        title: 'Data Produk',
        data: rows
    });
  });
  
  // GET create produk
  router.get('/create', function(req, res, next) {
    res.render('Produk/create', {
      title: 'Tambah Produk',
      nama_produk: '',
      harga_produk: '',
      id_kategori: '',
      gambar_produk: ''
    })
});

// Edit Produk
router.get('/edit/(:id)', async function(req, res, next) {
  let id = req.params.id;
  let rows = await  model_produk.getid(id);
        res.render('Produk/edit',{
        id_produk: rows[0].id_produk,
        nama_produk: rows[0].nama_produk,
        harga_produk: rows[0].harga_produk,
        id_kategori: rows[0].id_kategori,
        gambar_produk: rows[0].gambar_produk
      })
  })

// Delete produk
router.get('/delete/(:id)', async function(req, res){
  let id = req.params.id;
  req.flash('success','Data terhapus!');
  res.redirect('/produk');res.redirect('/produk');
})
});

// POST store produk
router.post('/store', async function (req, res, next) {
  try {
    let { nama_produk, harga, kategori } = req.body;
    let Data = {
      nama_produk,
      harga,
      kategori
    };  
_produk, id_kategori, gambar_produk } = req.body;
    let Data = {
      nama_produk,
      harga_produk,
      id_kategori,
      gambar_produk'error', 'Terjadi kesalahan pada fungsi');
    res.redirect('/produk');
  }
});


// POST update produk
router.post('/update/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let {nama_produk, harga, kategori} = req.body;
    let Data = {
      nama_produk,
      harga,
      kategori
    };  _produk, id_kategori, gambar_produk} = req.body;
    let Data = {
      nama_produk,
      harga_produk,
      id_kategori,
      gambar_produkct('/produk');
  } catch (error) {
    req.flash('error', 'Terjadi kesalahan pada fungsi');
    res.redirect('/produk');
  }
});


module.exports = router;