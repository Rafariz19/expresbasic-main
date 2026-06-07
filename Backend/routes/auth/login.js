var express = require('express');
var router = express.Router();
const model2_users = require('../../model/model2_users');

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username dan password harus diisi' });
    }

    try {
        const result = await model2_users.login(username, password);
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
});

module.exports = router;