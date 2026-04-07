var express = require('express');
var router = express.Router();
const connection = require("../config/database.js");
const model_kategori = require('../Model/model_kategori.js');

router.get('/', async function(req, res, next) {
    let rows = await model_kategori.getAll();

    res.render('kategori/index', {
        title: 'Data Kategori',
        data: rows
    });
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

// Delete kategori
router.get('/delete/(:id)', async function(req, res){
  let id = req.params.id;
  await model_kategori.delete(id);
  connection.query('delete from kategori where id_kategori =' + id,function(err){
  if (err) {
    req.flash('error', 'Gagal menghapus data');
  }else{
    req.flash('success','Data terhapus!');
  }
  res.redirect('/kategori');
})
});

// POST store kategori
router.post('/store', async function (req, res, next) {
  try {
    let { nama_kategori } = req.body;
    let Data = {
      nama_kategori
    };  

    await model_kategori.Store(Data);
    res.redirect('/kategori');
  } catch (error) {
    req.flash('error', 'Terjadi kesalahan pada fungsi');
    res.redirect('/kategori');
  }
});


// POST update kategori
router.post('/update/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let {nama_kategori} = req.body;
    let Data = {
      nama_kategori
    };  

    await model_kategori.update(id, Data);
    req.flash('succes', 'Berhasil mengupdate');
    res.redirect('/kategori');
  } catch (error) {
    req.flash('error', 'Terjadi kesalahan pada fungsi');
    res.redirect('/kategori');
  }
});


module.exports = router;