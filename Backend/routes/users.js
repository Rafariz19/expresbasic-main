var express = require('express');
const Model_Users = require('../Model/model_users');
var router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res, next) {
    try {
        let id = req.session.userId;
        if (!id) {
            return res.status(401).redirect('/login');
        }

        let Data = await Model_Users.getId(id);
        if (Data.length > 0) {
            res.render('users/index', {
                title: 'Users Home',
                username: Data[0].username
            });
        } else {
            res.status(404).json({ error: 'user tidak ada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

module.exports = router;