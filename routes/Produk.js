var express = require('express');
var router = express.Router();
const path = require('path');
const multer = require('multer');
const model_produk = require('../Model/model_produk.js');
const model_kategori = require('../Model/model_kategori.js');

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, '../public/uploads'));
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    }),
    fileFilter: function (req, file, cb) {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Hanya file gambar yang diizinkan'), false);
        }
        cb(null, true);
    }
});

router.get('/', async function(req, res, next) {
    try {
        let rows = await model_produk.getAll();
        res.render('Produk/index', {
            title: 'Data Produk',
            data: rows
        });
    } catch (error) {
        next(error);
    }
});

// GET create produk
router.get('/create', async function(req, res, next) {
    try {
        let kategori = await model_kategori.getAll();
        res.render('Produk/create', {
            title: 'Tambah Produk',
            nama_produk: '',
            harga_produk: '',
            id_kategori: '',
            gambar_produk: '',
            kategori: kategori
        });
    } catch (error) {
        next(error);
    }
});

// GET edit produk
router.get('/edit/:id', async function(req, res, next) {
    try {
        let id = req.params.id;
        let rows = await model_produk.getid(id);
        let kategori = await model_kategori.getAll();

        if (!rows || rows.length === 0) {
            req.flash('error', 'Produk tidak ditemukan');
            return res.redirect('/produk');
        }

        res.render('Produk/edit', {
            title: 'Edit Produk',
            id_produk: rows[0].id_produk,
            nama_produk: rows[0].nama_produk,
            harga_produk: rows[0].harga_produk,
            id_kategori: rows[0].id_kategori,
            gambar_produk: rows[0].gambar_produk,
            kategori: kategori
        });
    } catch (error) {
        next(error);
    }
});

// DELETE produk
router.get('/delete/:id', async function(req, res, next) {
    try {
        let id = req.params.id;
        await model_produk.delete(id);
        req.flash('success', 'Data terhapus!');
        res.redirect('/produk');
    } catch (error) {
        next(error);
    }
});

// POST store produk
router.post('/store', upload.single('gambar_produk'), async function(req, res, next) {
    try {
        let { nama_produk, harga_produk, id_kategori } = req.body;
        let gambar_produk = req.file ? '/uploads/' + req.file.filename : '';
        let Data = {
            nama_produk,
            harga_produk,
            id_kategori,
            gambar_produk
        };

        await model_produk.Store(Data);
        req.flash('success', 'Data berhasil ditambahkan!');
        res.redirect('/produk');
    } catch (error) {
        next(error);
    }
});

// POST update produk
router.post('/update/:id', upload.single('gambar_produk'), async function(req, res, next) {
    try {
        let id = req.params.id;
        let { nama_produk, harga_produk, id_kategori, current_gambar_produk } = req.body;
        let gambar_produk = req.file ? '/uploads/' + req.file.filename : current_gambar_produk || '';
        let Data = {
            nama_produk,
            harga_produk,
            id_kategori,
            gambar_produk
        };

        await model_produk.update(id, Data);
        req.flash('success', 'Data berhasil diupdate!');
        res.redirect('/produk');
    } catch (error) {
        next(error);
    }
});

module.exports = router;