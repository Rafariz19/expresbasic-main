var express = require("express");
const model_produk = require("../Model/model_produk");
const model_kategori = require("../Model/model_kategori");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
var router = express.Router();

// konfigurasi multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, basename.replace(/\s+/g, "-").toLowerCase() + "-" + Date.now() + ext);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowed = [".png", ".jpg", ".jpeg", ".gif"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new Error("Hanya file gambar (.png .jpg .jpeg .gif) yang diperbolehkan"));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.get("/", async function (req, res, next) {
  try {
    let rows = await model_produk.getAll();

    let formattedData = rows.map(function (row) {
      return {
        no: row.id_produk,
        nama: row.nama_produk,
        harga: row.harga_produk,
        kategori: row.nama_kategori || "-",
        foto: row.gambar_produk ? "/uploads/" + row.gambar_produk : null,
      };
    });

    const perPage = 10;
    const currentPage = parseInt(req.query.page) || 1;
    const totalPages = Math.ceil(formattedData.length / perPage);
    const startIndex = (currentPage - 1) * perPage;
    const paginatedData = formattedData.slice(startIndex, startIndex + perPage);

    res.render("Produk/index", {
      title: "Produk",
      produk: paginatedData,
      allProduk: formattedData,
      currentPage: currentPage,
      totalPages: totalPages,
      totalData: formattedData.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan pada database");
  }
});

router.get("/create", async function (req, res, next) {
  try {
    let categories = await model_kategori.getAll();
    res.render("Produk/create", {
      title: "Tambah Produk",
      nama_produk: "",
      harga_produk: "",
      id_kategori: "",
      kategori: categories,
      gambar_produk: "",
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Terjadi kesalahan");
    res.redirect("/produk");
  }
});

router.post("/store", upload.single("gambar_produk"), async function (req, res, next) {
  try {
    let { nama_produk, harga_produk, id_kategori } = req.body;
    let Data = { nama_produk, harga_produk, id_kategori };
    if (req.file) {
      Data.gambar_produk = req.file.filename;
    }
    await model_produk.Store(Data);
    req.flash("success", "Berhasil menyimpan data!");
    res.redirect("/produk");
  } catch (err) {
    console.error(err);
    req.flash("error", "Gagal menyimpan data!");
    res.redirect("/produk");
  }
});

router.get("/edit/:no", async function (req, res, next) {
  try {
    let no = req.params.no;
    let rows = await model_produk.getid(no);

    if (rows.length <= 0) {
      req.flash("error", "Data Produk tidak ditemukan");
      return res.redirect("/produk");
    }

    let categories = await model_kategori.getAll();
    res.render("Produk/edit", {
      title: "Edit Produk",
      id_produk: rows[0].id_produk,
      nama_produk: rows[0].nama_produk,
      harga_produk: rows[0].harga_produk,
      id_kategori: rows[0].id_kategori,
      kategori: categories,
      gambar_produk: rows[0].gambar_produk ? "/uploads/" + rows[0].gambar_produk : null,
      current_gambar_produk: rows[0].gambar_produk || "",
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Terjadi kesalahan saat mengambil data");
    res.redirect("/produk");
  }
});

router.post("/update/:no", upload.single("gambar_produk"), async function (req, res, next) {
  try {
    let id = req.params.no;
    let { nama_produk, harga_produk, id_kategori } = req.body;
    let Data = { nama_produk, harga_produk, id_kategori };

    let productRows = await model_produk.getid(id);
    if (productRows.length <= 0) {
      req.flash("error", "Data Produk tidak ditemukan");
      return res.redirect("/produk");
    }

    if (req.file) {
      if (productRows[0].gambar_produk) {
        let existingPath = path.join(__dirname, "../public/uploads", productRows[0].gambar_produk);
        if (fs.existsSync(existingPath)) {
          fs.unlinkSync(existingPath);
        }
      }
      Data.gambar_produk = req.file.filename;
    }

    await model_produk.update(id, Data);
    req.flash("success", "Berhasil mengupdate data produk!");
    res.redirect("/produk");
  } catch (err) {
    console.error(err);
    req.flash("error", "Gagal mengupdate data!");
    res.redirect("/produk");
  }
});

router.get("/delete/:no", async function (req, res, next) {
  try {
    let no = req.params.no;
    let rows = await model_produk.getid(no);
    if (rows.length <= 0) {
      req.flash("error", "Data Produk tidak ditemukan");
      return res.redirect("/produk");
    }
    res.render("Produk/delete", {
      title: "Hapus Produk",
      id_produk: rows[0].id_produk,
      nama_produk: rows[0].nama_produk,
      harga_produk: rows[0].harga_produk,
      id_kategori: rows[0].id_kategori,
      gambar_produk: rows[0].gambar_produk ? "/uploads/" + rows[0].gambar_produk : null,
    });
  } catch (err) {
    console.error(err);
    res.redirect("/produk");
  }
});

router.post("/destroy/:no", async function (req, res, next) {
  try {
    let id = req.params.no;
    let rows = await model_produk.getid(id);
    if (rows.length > 0 && rows[0].gambar_produk) {
      let imagePath = path.join(__dirname, "../public/uploads", rows[0].gambar_produk);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    await model_produk.delete(id);
    req.flash("success", "Berhasil menghapus data produk!");
    res.redirect("/produk");
  } catch (err) {
    console.error(err);
    req.flash("error", "Gagal menghapus data!");
    res.redirect("/produk");
  }
});

module.exports = router;