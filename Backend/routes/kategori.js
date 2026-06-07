var express = require('express');
var router = express.Router();
const connection = require("../config/database.js");
const model_kategori = require('../Model/model_kategori.js');

var verifyToken = require('../config/middleware/jwt.js');

router.get('/', verifyToken, async function(req, res, next) {
    let rows = await model_kategori.getAll();

    return res.status(200).json({
      status: true,
      message: 'Data kategori',
      data: rows
    })

    //1
    // res.render('kategori/index', {
    //     title: 'Data Kategori',
    //     data: rows
    // });
  });
  
  // GET create kategori
  router.get('/create', function(req, res, next) {
    res.render('kategori/create', {
      title: 'Tambah Kategori',
      nama_kategori: ''
    })
    
});

// Edit Kategori
router.get('/edit/(:id)', async function(req, res, next) {
  let id = req.params.id;
  let rows = await  model_kategori.getid(id);
        res.render('kategori/edit',{
        id: rows[0].id_kategori,
        nama_kategori: rows[0].nama_kategori
      })
  })

// Delete kategori (get)
router.delete('/delete/(:id)', async function(req, res){
  try {
    let id = req.params.id;
    await model_kategori.delete(id);
    return res.status(201).json({
      status: true,
      message: 'Data berhasil di hapus'
    })
    // req.flash('success','Data terhapus!');
  } catch (error) {
    req.flash('error', 'Gagal menghapus data');
  }
  res.redirect('/kategori');
});

// POST store kategori
router.post('/store', async function (req, res, next) {
  try {
    let { nama_kategori } = req.body;
    let Data = {
      nama_kategori
    };  
    await model_kategori.Store(Data);
    return res.status(201).json({
      status: true,
      message: 'Data Kategori berhasil di tambahkan'
    })
    // res.redirect('/kategori');
  } catch (error) {
    req.flash('error', 'Terjadi kesalahan pada fungsi');
    res.redirect('/kategori');
  }
});


// POST update kategori
router.patch('/update/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let {nama_kategori} = req.body;
    let Data = {
      nama_kategori
    };  

    await model_kategori.update(id, Data);
    return res.status(201).json({
      status: true,
      message: 'Data kategori berhasil di perbarui'
    })
    // req.flash('succes', 'Berhasil mengupdate');
    // res.redirect('/kategori');
  } catch (error) {
    return res.status(500).json({
      status: true,
      message: 'Terjadi kesalahan pada router'
    })
    // req.flash('error', 'Terjadi kesalahan pada fungsi');
    // res.redirect('/kategori');
  }
});


module.exports = router;