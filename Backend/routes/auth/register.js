var express = require('express');
var router = express.Router();
const model2_users = require('../../Model/model2_users')

router.post('/', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username dan password harus diisi' });
    }

    try {
        const existingUser = await model2_users.getByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: 'Username sudah digunakan' });
        }
        await model2_users.registerUser(username, password);
        res.status(201).json({ message: 'Registrasi berhasil' });
    } catch (err) {
        res.status(500).json({ message: 'Terjadi kesalahan', error: err });
    }
});

module.exports = router;