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

router.get('/updatepwd', async function(req, res){
    try {
        let id = req.session.userId;
        if (!id) {
            return res.status(401).redirect('/login');
        }
        let Data = await Model_Users.getId(id);
        if (Data.length > 0) {
            res.render('users/pwd', {
                title: 'Ganti Password',
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

router.post('/changepwd', async function(req, res, next){
    try {
        let id = req.session.userID;
        let {password} = req.body;
        let enkripsi = await bcrypt.hash(password, 10)
        let Data = {
            password: enkripsi
        }
        await Model_Users.Update(id, Data);
        req.flash('success','Password has ben change !');
        res.redirect('/users');
    } catch {
        req.flash('error','Terjadi kelasalahn pada fungsi');
        res.redirect('/users');
    }
})
module.exports = router;